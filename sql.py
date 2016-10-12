__author__ = 'Samuel Gratzl'

from flask import Flask, request, abort
from caleydo_server.config import view as configview
import itertools
from caleydo_server.util import jsonify
import sqlalchemy

#import such that it the sql driver uses gevent
import sql_use_gevent

import logging
_log = logging.getLogger(__name__)

import caleydo_server.config
c = caleydo_server.config.view('targid2')

app = Flask(__name__)

def _to_config(p):
  config =  configview(p.configKey)
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

configs = { p.id : _to_config(p) for p in caleydo_server.plugin.list('targid-sql-database-definition') }

def _resolve(database):
  return configs[database]


def load_ids(idtype, mapping):
  import caleydo_server.plugin

  manager = caleydo_server.plugin.lookup('idmanager')
  manager.load(idtype, mapping)

def assign_ids(rows, idtype):
  import caleydo_server.plugin

  manager = caleydo_server.plugin.lookup('idmanager')
  for _id, row in itertools.izip(manager((r['id'] for r in rows), idtype), rows):
    row['_id'] = _id
  return rows

def _run(db ,sql, **kwargs):
  _log.info(sqlalchemy.sql.text(sql))
  result = db.execute(sqlalchemy.sql.text(sql),**kwargs)
  columns = result.keys()
  return [{c: r[c] for c in columns} for r in result]

def _run_to_index(db, sql, **kwargs):
  result = db.execute(sqlalchemy.sql.text(sql),**kwargs)
  return [r['_index'] for r in result]

def _concat(v):
  if type(v) is list:
    return '\n'.join(v)
  return v

def _get_data(database, viewName, replacements={}):
  config, engine = _resolve(database)
  # convert to index lookup
  # row id start with 1
  view = config.view('views.' + viewName)
  kwargs = {}
  if view['arguments'] is not None:
    for arg in view['arguments']:
      kwargs[arg] = request.args[arg]

  replace = {}
  if view['replacements'] is not None:
    for arg in view['replacements']:
      if arg in replacements:
        replace[arg] = replacements[arg]
      else:
        replace[arg] = request.args.get(arg, '')

  db = engine.connect()
  if 'i' in request.args:
    kwargs['query'] = request.args['i']
    r = _run(db, view['querySlice'] % replace, **kwargs)
    indices = map(int, request.args['i'].split(','))
    r.sort(lambda a, b: indices.index(a['_index']) - indices.index(b['_index']))
  else:
    r = _run(db, _concat(view['query']) % replace, **kwargs)
  return r, view


@app.route('/_loadmappings')
def load_mappings():
  """
  load all given mappings in the id assigner upon request - HACK
  :return:
  """
  summary = {}
  for config, engine in configs.values():
    for idtype, query in config.get('mappings').items():
      _log.info('load mappings of %s using: %s',idtype, sqlalchemy.sql.text(query))
      result = engine.execute(sqlalchemy.sql.text(query))
      mapping = [(r['id'], r['_id']) for r in result]
      _log.info('loading %d mappings', len(mapping))
      load_ids(idtype, mapping)
      _log.info('loaded %d mappings', len(mapping))
      summary[idtype] = len(mapping)

  return jsonify(summary)

@app.route('/<database>/<viewName>')
def get_data(database, viewName):
  r, view = _get_data(database, viewName)
  #r = assign_ids(r, view['idType'])
  return jsonify(r)

@app.route('/<database>/<viewName>/namedset/<namedsetId>')
def get_namedset_data(database, viewName, namedsetId):
  import storage
  namedset = storage.get_namedsetById(namedsetId)

  if len(namedset['ids']) == 0:
    return jsonify([])

  replace = {
    'ids': ','.join(str(id) for id in namedset['ids'])
  }
  viewNameNamedset = viewName + '_namedset'

  r, view = _get_data(database, viewNameNamedset, replace)
  return jsonify(r)

@app.route('/<database>/<viewName>/raw')
def get_raw_data(database, viewName):
  r, _ = _get_data(database, viewName)
  return jsonify(r)

@app.route('/<database>/<viewName>/raw/<col>')
def get_raw_col_data(database, viewName, col):
  r, _ = _get_data(database, viewName)
  return jsonify([ e[col] for e in r])

def _check_column(col, view):
  cols = view.columns
  if col in cols:
    return cols[col]['label']
  #bad request
  abort(400)

@app.route('/<database>/<viewName>/desc')
def get_desc(database, viewName):
  config, engine = _resolve(database)
  #convert to index lookup
  #row id start with 1
  db = engine.connect()
  view = config.view('views.'+viewName)

  number_columns = []
  categorical_columns = []
  infos = {}
  for k,v in view['columns'].items():
    ttype = v['type']
    infos[v['label']] = v.copy()
    if ttype == 'number':
      number_columns.append(v['label'])
    elif ttype == 'categorical':
      categorical_columns.append(k)

  if len(number_columns) > 0:
    row = next(iter(db.execute(sqlalchemy.sql.text(_concat(view['queryStats'])))))
    for num_col in number_columns:
      infos[num_col]['min'] = row[num_col + '_min']
      infos[num_col]['max'] = row[num_col+'_max']
  for cat_col in categorical_columns:
    cats = [ r['cat'] for r in db.execute(sqlalchemy.sql.text(_concat(view['queryCategories']) % dict(col=cat_col)))]
    infos[view['columns'][cat_col]['label']]['categories'] = cats

  r = dict(idType=view['idType'],
           columns=infos)
  return jsonify(r)

@app.route('/<database>/<viewName>/sample')
def get_sample(database, viewName):
  config, engine = _resolve(database)
  db = engine.connect()
  view = config.view('views.'+viewName)

  l = int(request.args.get('length',100))
  r = _run_to_index(db, _concat(view['querySample']) % (l, ))
  return jsonify(r)

@app.route('/<database>/<viewName>/sort')
def sort(database, viewName):
  config, engine = _resolve(database)
  db = engine.connect()
  view = config.view('views.' + viewName)
  asc = 'asc' if request.args.get('_asc','false') == 'true' else 'desc'
  if '_column' in request.args:
    query = view['querySort'] % (_check_column(request.args['_column'],view), asc)
  else:
    #multi criteria -> create a computed score field
    score = ' + '.join(('( {} * {} )'.format(_check_column(k,view),float(v)) for k,v in request.args.items() if not k.startswith('_')))
    query = _concat(view['querySort']) % (score, asc)
  r = _run_to_index(db, query)
  return jsonify(r)

@app.route('/<database>/<viewName>/search')
def search(database, viewName):
  config, engine = _resolve(database)
  db = engine.connect()
  view = config.view('views.' + viewName)
  query = '%'+request.args['query']+'%'
  column = _check_column(request.args['column'], view)
  r = _run_to_index(db, _concat(view['querySearch']) % (column, ),query=query)
  return jsonify(r)

@app.route('/<database>/<viewName>/match')
def match(database, viewName):
  return search(database, viewName)

 # 'row_number() over(order by x) as index'
 # 'rowid'

@app.route('/<database>/<viewName>/lookup')
def lookup(database, viewName):
  """
  Does the same job as search, but paginates the result set
  This function is used in conjunction with Select2 form elements
  """
  config, engine = _resolve(database)
  db = engine.connect()
  view = config.view('views.' + viewName)

  if view['query'] is None or view['count'] is None:
    r = dict(total_count=0, items=[])
    return jsonify(r)

  page = request.args.get('page', None)
  limit = 30 #or 'all'
  offset = 0
  if page is not None:
    try:
      page = int(page)
      if isinstance(page, int) and page > 0:
        offset = (page-1) * limit
    except:
      pass

  arguments = {
    #'query': '%' + request.args['query'] + '%'
    'query': str(request.args.get('query', '')).lower() + '%'
  }

  replace = {}
  if view['replacements'] is not None:
    replace = { arg: request.args.get(arg, '') for arg in view['replacements'] }

  replace['limit'] = limit
  replace['offset'] = offset

  print replace

  r_items = _run(db, _concat(view['query']) % replace, **arguments)
  r_total_count = _run(db, _concat(view['count']) % replace, **arguments)

  r = dict(total_count=r_total_count[0]['total_count'], items=r_items, items_per_page=limit)
  return jsonify(r)


def create():
  """
   entry point of this plugin
  """
  app.debug = True
  return app


if __name__ == '__main__':
  app.debug = True
  app.run(host='0.0.0.0')
