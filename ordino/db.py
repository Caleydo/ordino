from phovea_server.config import view as configview
import itertools
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
    connector.statement_timeout = config['statement_timeout']

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
  return configs[database]


def assign_ids(rows, idtype):
  import phovea_server.plugin

  manager = phovea_server.plugin.lookup('idmanager')
  for _id, row in itertools.izip(manager((r['id'] for r in rows), idtype), rows):
    row['_id'] = _id
  return rows


def to_query(q):
  return sqlalchemy.sql.text(q)


class WrappedSession(object):
  def __init__(self, engine):
    from sqlalchemy.orm import sessionmaker, scoped_session
    _log.info('creating session')
    self._session = scoped_session(sessionmaker(bind=engine))()

  def execute(self, query, **kwargs):
    return self._session.execute(to_query(query), kwargs)

  def run(self, sql, **kwargs):
    sql = to_query(sql)
    _log.info(sql)
    result = self._session.execute(sql, kwargs)
    columns = result.keys()
    return [{c: r[c] for c in columns} for r in result]

  def run_to_index(self, sql, **kwargs):
    sql = to_query(sql)
    result = self._session.execute(sql, kwargs)

    return [r['_index'] for r in result]

  def __enter__(self):
    return self

  def __exit__(self, exc_type, exc_val, exc_tb):
    _log.info('removing session again')
    self._session.close()
    self._session = None


def session(engine):
  return WrappedSession(engine)


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

  replacements['agg_score'] = query % replace

  return replacements


def _prepare_arguments(view, config, replacements=None, arguments=None, extra_sql_argument=None):
  replacements = replacements or {}
  arguments = arguments or {}
  replacements = _handle_aggregated_score(config, replacements, arguments)

  # convert to index lookup
  kwargs = {}
  if view.arguments is not None:
    for arg in view.arguments:
      kwargs[arg] = arguments[arg]

  if extra_sql_argument is not None:
    kwargs.update(extra_sql_argument)

  replace = {}
  if view.replacements is not None:
    for arg in view.replacements:
      if arg in replacements:
        replace[arg] = replacements[arg]
      else:
        replace[arg] = arguments.get(arg, '')

  return kwargs, replace


def get_data(database, view_name, replacements=None, arguments=None, extra_sql_argument=None):
  config, engine = resolve(database)
  view = config.views[view_name]

  kwargs, replace = _prepare_arguments(view, config, replacements, arguments, extra_sql_argument)

  with session(engine) as sess:
    if config.statement_timeout is not None:
      _log.info('set statement_timeout to {}'.format(config.statement_timeout))
      sess.execute('set statement_timeout to {}'.format(config.statement_timeout))
    if 'i' in arguments:
      kwargs['query'] = arguments['i']
      r = sess.run(view['querySlice'] % replace, **kwargs)
      indices = map(int, arguments['i'].split(','))
      r.sort(lambda a, b: indices.index(a['_index']) - indices.index(b['_index']))
    else:
      r = sess.run(view.query % replace, **kwargs)
  return r, view


def get_count(database, view_name, replacements=None, arguments=None, extra_sql_argument=None):
  config, engine = resolve(database)
  view = config.views[view_name]

  kwargs, replace = _prepare_arguments(view, config, replacements, arguments, extra_sql_argument)

  if 'count' in view.queries:
    count_query = view.queries['count'] % replace
  else:
    query = view.query % replace
    # heuristic replace everything before ' FROM ' with a select count(*)
    from_clause = query.upper().index(' FROM ')
    count_query = 'SELECT count(*)' + query[from_clause:]

  with session(engine) as sess:
    if config.statement_timeout is not None:
      _log.info('set statement_timeout to {}'.format(config.statement_timeout))
      sess.execute('set statement_timeout to {}'.format(config.statement_timeout))
    r = sess.run(count_query, **kwargs)
  if r:
    return r[0]['count']
  return 0
