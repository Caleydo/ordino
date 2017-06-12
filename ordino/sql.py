from phovea_server.ns import Namespace, request, abort
from . import db
from .utils import map_scores
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


def _replace_named_sets_in_ids(v):
  """
  replaces magic named sets references with their ids
  :param v:
  :return:
  """
  import storage
  import phovea_server.plugin

  manager = phovea_server.plugin.lookup('idmanager')

  union = set()

  def add_namedset(vi):
    # convert named sets to the primary ids
    namedset_id = vi
    namedset = storage.get_namedset_by_id(namedset_id)
    uids = namedset['ids']
    id_type = namedset['idType']
    ids = manager.unmap(uids, id_type)
    for id in ids:
      union.add(id)

  if isinstance(v, list):
    for vi in v:
      add_namedset(vi)
  else:
    add_namedset(v)
  return list(union)


def _replace_range_in_ids(v, id_type):
  import phovea_server.plugin
  from phovea_server.range import parse

  manager = phovea_server.plugin.lookup('idmanager')

  union = set()

  def add_range(r):
    # convert named sets to the primary ids
    uids = parse(r)[0].tolist()
    ids = manager.unmap(uids, id_type)
    for id in ids:
      union.add(id)

  if isinstance(v, list):
    for vi in v:
      add_range(vi)
  else:
    add_range(v)
  return list(union)


def _filter_logic(view):
  """
  parses the request arguments for filter
  :param view:
  :return:
  """
  args = request.args
  processed_args = dict()
  extra_args = dict()
  where_clause = {}
  for k, v in args.lists():
    if k.endswith('[]'):
      k = k[:-2]
    if k.startswith('filter_'):
      where_clause[k[7:]] = v  # remove filter_
    else:
      processed_args[k] = v[0] if len(v) == 1 else v

  # handle special namedset4 filter types by resolve them and and the real ids as filter
  for k, v in where_clause.items():
    if k.startswith('namedset4'):
      del where_clause[k]  # delete value
      real_key = k[9:]  # remove the namedset4 part
      ids = _replace_named_sets_in_ids(v)
      if real_key not in where_clause:
        where_clause[real_key] = ids
      else:
        where_clause[real_key].extend(ids)
    if k.startswith('rangeOf'):
      del where_clause[k]  # delete value
      id_type_and_key = k[7:]
      id_type = id_type_and_key[:id_type_and_key.index('4')]
      real_key = id_type_and_key[id_type_and_key.index('4') + 1:]  # remove the range4 part
      ids = _replace_range_in_ids(v, id_type)
      if real_key not in where_clause:
        where_clause[real_key] = ids
      else:
        where_clause[real_key].extend(ids)

  def to_clause(k, v):
    l = len(v)
    kp = k.replace('.', '_')
    if l == 1:  # single value
      extra_args[kp] = v[0]
      operator = '='
    else:
      extra_args[kp] = tuple(v)
      operator = 'IN'
    # find the sub query to replace, can be injected for more complex filter operations based on the input
    sub_query = view.queries['filter_' + k] if 'filter_' + k in view.queries else k + ' %(operator)s %(value)s'
    return sub_query % dict(operator=operator, value=':' + kp)

  where_clause = [to_clause(k, v) for k, v in where_clause.items() if len(v) > 0]
  processed_args['and_where'] = (' AND ' + ' AND '.join(where_clause)) if where_clause else ''
  processed_args['where'] = (' WHERE ' + ' AND '.join(where_clause)) if where_clause else ''

  return processed_args, extra_args


@app.route('/<database>/<view_name>/filter')
def get_filtered_data(database, view_name):
  """
  version of getting data in which the arguments starting with `filter_` are used to build a where clause
  :param database:
  :param view_name:
  :return:
  """
  config, _ = db.resolve(database)
  # convert to index lookup
  # row id start with 1
  view = config.views[view_name]
  processed_args, extra_args = _filter_logic(view)

  r, view = db.get_data(database, view_name, None, processed_args, extra_args)

  if request.args.get('_assignids', False):
    r = db.assign_ids(r, view.idtype)
  return jsonify(r)


@app.route('/<database>/<view_name>/score')
def get_score_data(database, view_name):
  """
  version of getting data like filter with additional mapping of score entries
  :param database:
  :param view_name:
  :return:
  """
  config, _ = db.resolve(database)
  # convert to index lookup
  # row id start with 1
  view = config.views[view_name]
  processed_args, extra_args = _filter_logic(view)

  r, view = db.get_data(database, view_name, None, processed_args, extra_args)

  data_idtype = view.idtype
  target_idtype = request.args.get('target', data_idtype)

  if data_idtype != target_idtype:
    mapped_scores = map_scores(r, data_idtype, target_idtype)
  else:
    mapped_scores = r

  if request.args.get('_assignids', False):
    mapped_scores = db.assign_ids(mapped_scores, target_idtype)
  return jsonify(mapped_scores)


@app.route('/<database>/<view_name>/count')
def get_count_data(database, view_name):
  """
  similar to the /filter clause but returns the count of results instead of the rows itself
  :param database:
  :param view_name:
  :return:
  """
  config, _ = db.resolve(database)
  # convert to index lookup
  view = config.views[view_name]
  processed_args, extra_args = _filter_logic(view)

  r = db.get_count(database, view_name, None, processed_args, extra_args)

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
  arguments = dict(query='%' + str(request.args.get('query', '')).lower() + '%', species=str(request.args.get('species', '')))

  replace = {}
  if view.replacements is not None:
    replace = {arg: request.args.get(arg, '') for arg in view.replacements}

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
