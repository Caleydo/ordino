from phovea_server.ns import Namespace, request, abort
from . import db
from phovea_server.util import jsonify
import logging

__author__ = 'Samuel Gratzl'
_log = logging.getLogger(__name__)
app = Namespace(__name__)


def load_ids(idtype, mapping):
  import phovea_server.plugin

  manager = phovea_server.plugin.lookup('idmanager')
  manager.load(idtype, mapping)


def _get_data(database, view_name, replacements=None):
  return db.get_data(database, view_name, replacements, request.args)


@app.route('/<database>/<view_name>')
def get_data_api(database, view_name):
  r, view = _get_data(database, view_name)

  if request.args.get('_assignids', False):
    r = db.assign_ids(r, view.idtype)
  return jsonify(r)


@app.route('/<database>/<view_name>/namedset/<namedset_id>')
def get_namedset_data(database, view_name, namedset_id):
  import storage
  namedset = storage.get_namedset_by_id(namedset_id)

  if len(namedset['ids']) == 0:
    return jsonify([])

  replace = dict(ids=','.join(str(id) for id in namedset['ids']))
  view_name_namedset = view_name + '_namedset'

  r, _ = _get_data(database, view_name_namedset, replace)
  return jsonify(r)


@app.route('/<database>/<view_name>/raw')
def get_raw_data(database, view_name):
  r, _ = _get_data(database, view_name)
  return jsonify(r)


@app.route('/<database>/<view_name>/raw/<col>')
def get_raw_col_data(database, view_name, col):
  r, _ = _get_data(database, view_name)
  return jsonify([e[col] for e in r])


def _check_column(col, view):
  cols = view.columns
  if col in cols:
    return cols[col]['label']
  # bad request
  abort(400)


@app.route('/<database>/<view_name>/desc')
def get_desc(database, view_name):
  config, engine = db.resolve(database)
  # convert to index lookup
  # row id start with 1
  view = config.views[view_name]

  number_columns = []
  categorical_columns = []
  infos = {}
  for k, v in view.columns.items():
    ttype = v['type']
    infos[v['label']] = v.copy()
    if ttype == 'number':
      number_columns.append(v['label'])
    elif ttype == 'categorical':
      categorical_columns.append(k)

  with db.session(engine) as session:
    if len(number_columns) > 0:
      row = next(iter(session.execute(view.queries['stats'])))
      for num_col in number_columns:
        infos[num_col]['min'] = row[num_col + '_min']
        infos[num_col]['max'] = row[num_col + '_max']
    for cat_col in categorical_columns:
      cats = [r['cat'] for r in session.execute(view.queries['categories'] % dict(col=cat_col))]
      infos[view.columns[cat_col]['label']]['categories'] = cats

  r = dict(idType=view.idtype, columns=infos)
  return jsonify(r)


@app.route('/<database>/<view_name>/search')
def search(database, view_name):
  config, engine = db.resolve(database)
  view = config.views[view_name]
  query = '%' + request.args['query'] + '%'
  column = _check_column(request.args['column'], view)
  with db.session(engine) as session:
    r = session.run_to_index(view.queries('search') % (column,), query=query)
  return jsonify(r)


@app.route('/<database>/<view_name>/match')
def match(database, view_name):
  return search(database, view_name)


@app.route('/<database>/<view_name>/lookup')
def lookup(database, view_name):
  """
  Does the same job as search, but paginates the result set
  This function is used in conjunction with Select2 form elements
  """
  config, engine = db.resolve(database)
  view = config.views[view_name]

  if view.query is None or 'count' not in view.queries:
    r = dict(total_count=0, items=[])
    return jsonify(r)

  page = request.args.get('page', None)
  limit = 30  # or 'all'
  offset = 0
  if page is not None:
    try:
      page = int(page)
      if isinstance(page, int) and page > 0:
        offset = (page - 1) * limit
    except:
      pass

  # 'query': '%' + request.args['query'] + '%'
  arguments = dict(query=str(request.args.get('query', '')).lower() + '%', species=str(request.args.get('species', '')))

  replace = {}
  if view.replacements is not None:
    replace = {arg: request.args.get(arg, '') for arg in view['replacements']}

  replace['limit'] = limit
  replace['offset'] = offset

  with db.session(engine) as session:
    r_items = session.run(view.query % replace, **arguments)
    r_total_count = session.run(view.queries['count'] % replace, **arguments)

  r = dict(total_count=r_total_count[0]['total_count'], items=r_items, items_per_page=limit)
  return jsonify(r)


def create():
  """
   entry point of this plugin
  """
  app.debug = True
  return app
