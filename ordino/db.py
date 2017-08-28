from phovea_server.config import view as configview
import itertools
from phovea_server.ns import abort
from phovea_server.plugin import list as list_plugins
import sqlalchemy
# import such that it the sql driver uses gevent
import sql_use_gevent  # noqa
import logging
import phovea_server.config

__author__ = 'Samuel Gratzl'

_log = logging.getLogger(__name__)
c = phovea_server.config.view('ordino')


def _to_config(p):
  config = configview(p.configKey)
  connector = p.load().factory()
  if not connector.dburl:
    connector.dburl = config['dburl']
  if not connector.statement_timeout:
    connector.statement_timeout = config.get('statement_timeout', default=None)
  if not connector.statement_timeout_query:
    connector.statement_timeout_query = config.get('statement_timeout_query', default=None)

  _log.info(connector.dburl)
  engine = sqlalchemy.create_engine(connector.dburl)
  # Assuming that gevent monkey patched the builtin
  # threading library, we're likely good to use
  # SQLAlchemy's QueuePool, which is the default
  # pool class.  However, we need to make it use
  # threadlocal connections
  # https://github.com/kljensen/async-flask-sqlalchemy-example/blob/master/server.py
  engine.pool._use_threadlocal = True

  return connector, engine


configs = {p.id: _to_config(p) for p in list_plugins('targid-sql-database-definition')}


def resolve(database):
  r = configs[database]
  if r:
    # derive needed columns
    connector, engine = r
    for view in connector.views.values():
      if view.needs_to_fill_up_columns():
        view.columns_filled_up = True
        _fill_up_columns(view, engine)
  return r


def assign_ids(rows, idtype):
  """
  assigns unique ids (stored in '_id') based on the 'id' column and given idtype
  :param rows: the rows having an 'id' column each
  :param idtype: the idtype to resolve the id
  :return: the extended rows
  """
  import phovea_server.plugin

  manager = phovea_server.plugin.lookup('idmanager')
  for _id, row in itertools.izip(manager((r['id'] for r in rows), idtype), rows):
    row['_id'] = _id
  return rows


def to_query(q):
  return sqlalchemy.sql.text(q)


class WrappedSession(object):
  def __init__(self, engine):
    """
    session wrapper of sql alchemy with auto cleanup
    :param engine:
    """
    from sqlalchemy.orm import sessionmaker, scoped_session
    _log.info('creating session')
    self._session = scoped_session(sessionmaker(bind=engine))()

  def execute(self, query, **kwargs):
    """
    execute the given query with the given args
    :param query: query
    :param kwargs: additional args to replace
    :return: the session result
    """
    sql = to_query(query)
    _log.info(sql)
    return self._session.execute(sql, kwargs)

  def run(self, sql, **kwargs):
    """
    runs the given sql statement, in contrast to execute the result will be converted to a list of dicts
    :param sql: the sql query to execute
    :param kwargs: args for this query
    :return: list of dicts
    """
    sql = to_query(sql)
    _log.info(sql)
    result = self._session.execute(sql, kwargs)
    columns = result.keys()
    return [{c: r[c] for c in columns} for r in result]

  def __enter__(self):
    return self

  def __exit__(self, exc_type, exc_val, exc_tb):
    _log.info('removing session again')
    self._session.close()
    self._session = None


def session(engine):
  return WrappedSession(engine)


def get_columns(engine, table_name):
  """
  returns the set of columns (name, type: (string|categorical|number), categories: string[]) for the given table or view
  :param engine: underlying engine
  :param table_name: table name which may include a schema prefix
  :return: the list of columns
  """
  schema = None
  if '.' in table_name:
    splitted = table_name.split('.')
    schema = splitted[0]
    table_name = splitted[1]
  inspector = sqlalchemy.inspect(engine)

  columns = inspector.get_columns(table_name, schema)

  def _normalize_columns(col):
    from sqlalchemy import types
    r = dict(label=col['name'], type='string', column=col['name'])
    t = col['type']
    if isinstance(t, types.Integer) or isinstance(t, types.Numeric):
      r['type'] = 'number'
    elif isinstance(t, types.Enum):
      r['type'] = 'categorical'
      r['categories'] = t.enums
    return r

  return map(_normalize_columns, columns)


def _handle_aggregated_score(config, replacements, args):
  """
  Handle aggregation for aggregated (and inverted aggregated) score queries
  :param replacements:
  :return replacements:
  """
  view = config.agg_score
  agg = args.get('agg', '')

  if agg == '' or view.query is None:
    return replacements

  query = view.query
  if agg in view.queries:
    query = view.queries[agg]

  replace = {}
  if view.replacements is not None:
    for arg in view.replacements:
      replace[arg] = args.get(arg, '')

  replacements['agg_score'] = query.format(**replace)

  return replacements


def prepare_arguments(view, config, replacements=None, arguments=None, extra_sql_argument=None):
  """
  prepares for the given view the kwargs and replacements based on the given input
  :param view: db view
  :param config: db connector config
  :param replacements: dict of generated or resolved replacements
  :param arguments: dict of arguments or as fallback replacements
  :param extra_sql_argument: additional unchecked kwargs
  :return: (kwargs, replace)
  """
  replacements = replacements or {}
  arguments = arguments or {}
  replacements = _handle_aggregated_score(config, replacements, arguments)
  secure_replacements = ['where', 'and_where', 'agg_score']  # has to be part of the computed replacements

  # convert to index lookup
  kwargs = {}
  if view.arguments is not None:
    for arg in view.arguments:
      if arg not in arguments:
        _log.warn('missing argument "%s": "%s"', view.query, arg)
        abort(400, 'missing argument: ' + arg)
      kwargs[arg] = arguments[arg]

  if extra_sql_argument is not None:
    kwargs.update(extra_sql_argument)

  replace = {}
  if view.replacements is not None:
    for arg in view.replacements:
      fallback = arguments.get(arg, '')
      if arg in secure_replacements:  # has to be part of the replacements
        value = replacements.get(arg, '')
      else:
        value = replacements.get(arg, fallback)  # if not a secure one fallback with an argument
      if not view.is_valid_replacement(arg, value):
        _log.warn('invalid replacement value detected "%s": "%s"="%s"', view.query, arg, value)
        abort(400, 'the given parameter "%s" is invalid' % arg)
      else:
        replace[arg] = value

  return kwargs, replace


def get_data(database, view_name, replacements=None, arguments=None, extra_sql_argument=None):
  """
  executes the given view name on the given database with the given arguments
  :param database: db connector name
  :param view_name: view name
  :param replacements: dict of replacements
  :param arguments: dict of arguments
  :param extra_sql_argument: additional unchecked kwargs for the query
  :return: (r, view) tuple of the resulting rows and the resolved view
  """
  config, engine = resolve(database)
  view = config.views[view_name]

  kwargs, replace = prepare_arguments(view, config, replacements, arguments, extra_sql_argument)

  with session(engine) as sess:
    if config.statement_timeout is not None:
      _log.info('set statement_timeout to {}'.format(config.statement_timeout))
      sess.execute(config.statement_timeout_query.format(config.statement_timeout))
    r = sess.run(view.query.format(**replace), **kwargs)
  return r, view


def get_count(database, view_name, replacements=None, arguments=None, extra_sql_argument=None):
  """
  similar to get_data but returns the count of resulting rows
  :param database: db connector name
  :param view_name: view name
  :param replacements: dict of replacements
  :param arguments: dict of arguments
  :param extra_sql_argument: additional unchecked kwargs for the query
  :return: the count of results
  """
  config, engine = resolve(database)
  view = config.views[view_name]

  kwargs, replace = prepare_arguments(view, config, replacements, arguments, extra_sql_argument)

  if 'count' in view.queries:
    count_query = view.queries['count']
  else:
    count_query = 'SELECT count(*) FROM {table} t {{where}}'.format(table=view.table)

  with session(engine) as sess:
    if config.statement_timeout is not None:
      _log.info('set statement_timeout to {}'.format(config.statement_timeout))
      sess.execute(config.statement_timeout_query.format(config.statement_timeout))
    r = sess.run(count_query.format(**replace), **kwargs)
  if r:
    return r[0]['count']
  return 0


def _fill_up_columns(view, engine):
  _log.info('fill up view')
  # update the real object
  columns = view.columns
  for col in get_columns(engine, view.table):
    name = col['column']
    if name in columns:
      # merge
      old = columns[name]
      for k, v in col.items():
        if k not in old:
          old[k] = v
    else:
      columns[name] = col

  # derive the missing domains and categories
  number_columns = [k for k, col in columns.items() if col['type'] == 'number' and ('min' not in col or 'max' not in col)]
  categorical_columns = [k for k, col in columns.items() if col['type'] == 'categorical' and 'categories' not in col]
  if number_columns or categorical_columns:
    with session(engine) as s:
      table = view.table
      if number_columns:
        template = 'min({col}) as {col}_min, max({col}) as {col}_max'
        minmax = ', '.join(template.format(col=col) for col in number_columns)
        row = next(iter(s.execute("""SELECT {minmax} FROM {table}""".format(table=table, minmax=minmax))))
        for num_col in number_columns:
          columns[num_col]['min'] = row[num_col + '_min']
          columns[num_col]['max'] = row[num_col + '_max']
      for col in categorical_columns:
        template = """SELECT distinct {col} as cat FROM {table} WHERE {col} <> '' and {col} is not NULL"""
        cats = s.execute(template.format(col=col, table=table))
        columns[col]['categories'] = [unicode(r['cat']) for r in cats if r['cat'] is not None]

  view.columns_filled_up = True
