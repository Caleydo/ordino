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
c = phovea_server.config.view('targid2')


def _to_config(p):
  config = configview(p.configKey)
  _log.info(config['dburl'])
  engine = sqlalchemy.create_engine(config['dburl'])
  # Assuming that gevent monkey patched the builtin
  # threading library, we're likely good to use
  # SQLAlchemy's QueuePool, which is the default
  # pool class.  However, we need to make it use
  # threadlocal connections
  # https://github.com/kljensen/async-flask-sqlalchemy-example/blob/master/server.py
  engine.pool._use_threadlocal = True

  return config, engine


configs = {p.id: _to_config(p) for p in list_plugins('targid-sql-database-definition')}


def resolve(database):
  return configs[database]


def assign_ids(rows, idtype):
  import phovea_server.plugin

  manager = phovea_server.plugin.lookup('idmanager')
  for _id, row in itertools.izip(manager((r['id'] for r in rows), idtype), rows):
    row['_id'] = _id
  return rows


def _concat(v):
  if type(v) is list:
    return '\n'.join(v)
  return v


def to_query(q):
  return sqlalchemy.sql.text(_concat(q))


class WrappedSession(object):
  def __init__(self, engine):
    from sqlalchemy.orm import sessionmaker, scoped_session
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
    self._session = None


def session(engine):
  return WrappedSession(engine)


def get_data(database, view_name, replacements=None, arguments=None):
  replacements = replacements or {}
  arguments = arguments or {}
  config, engine = resolve(database)
  # convert to index lookup
  # row id start with 1
  view = config.view('views.' + view_name)
  kwargs = {}
  if view['arguments'] is not None:
    for arg in view['arguments']:
      kwargs[arg] = arguments[arg]

  replace = {}
  if view['replacements'] is not None:
    for arg in view['replacements']:
      if arg in replacements:
        replace[arg] = replacements[arg]
      else:
        replace[arg] = arguments.get(arg, '')

  with session(engine) as sess:
    if 'i' in arguments:
      kwargs['query'] = arguments['i']
      r = sess.run(view['querySlice'] % replace, **kwargs)
      indices = map(int, arguments['i'].split(','))
      r.sort(lambda a, b: indices.index(a['_index']) - indices.index(b['_index']))
    else:
      r = sess.run(_concat(view['query']) % replace, **kwargs)
  return r, view
