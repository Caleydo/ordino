__author__ = 'Samuel Gratzl'

from flask import Flask, request, abort
from caleydo_server.config import view as configview
import caleydo_server.plugin
import itertools
from caleydo_server.util import jsonify
import sqlalchemy

import logging
_log = logging.getLogger(__name__)

app = Flask(__name__)

def _to_config(p):
  config =  configview(p.configKey)
  _log.info(config['dburl'])
  engine = sqlalchemy.create_engine(config['dburl'])
  return config, engine

configs = { p.id : _to_config(p) for p in caleydo_server.plugin.list('targid-sql-database-definition') }

def _resolve(database):
  return configs[database]

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

def _get_data(database, viewName):
  config, engine = _resolve(database)
  # convert to index lookup
  # row id start with 1
  view = config.view('views.' + viewName)
  kwargs = {}
  if view['arguments'] is not None:
    for arg in view['arguments']:
      kwargs[arg] = request.args[arg]
  replace = tuple()
  if view['replacements'] is not None:
    replace = tuple([request.args[arg] for arg in view['replacements']])
  db = engine.connect()
  if 'i' in request.args:
    kwargs['query'] = request.args['i']
    r = _run(db, view['querySlice'] % replace, **kwargs)
    indices = map(int, request.args['i'].split(','))
    r.sort(lambda a, b: indices.index(a['_index']) - indices.index(b['_index']))
  else:
    r = _run(db, view['query'] % replace, **kwargs)
  return r, view

@app.route('/<database>/<viewName>')
def get_data(database, viewName):
  r, view = _get_data(database, viewName)
  r = assign_ids(r, view['idType'])
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
    row = next(iter(db.execute(sqlalchemy.sql.text(view['queryStats']))))
    for num_col in number_columns:
      infos[num_col]['min'] = row[num_col + '_min']
      infos[num_col]['max'] = row[num_col+'_max']
  for cat_col in categorical_columns:
    cats = [ r['Category'] for r in db.execute(sqlalchemy.sql.text(view['queryCategories'] % (cat_col,)))]
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
  r = _run_to_index(db, view['querySample'] % (l, ))
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
    query = view['querySort'] % (score, asc)
  r = _run_to_index(db, query)
  return jsonify(r)

@app.route('/<database>/<viewName>/search')
def search(database, viewName):
  config, engine = _resolve(database)
  db = engine.connect()
  view = config.view('views.' + viewName)
  query = '%'+request.args['query']+'%'
  column = _check_column(request.args['column'], view)
  r = _run_to_index(db, view['querySearch'] % (column, ),query=query)
  return jsonify(r)

 # 'row_number() over(order by x) as index'
 # 'rowid'

def create():
  """
   entry point of this plugin
  """
  app.debug = True
  return app


if __name__ == '__main__':
  app.debug = True
  app.run(host='0.0.0.0')
