from phovea_server.ns import Namespace, request
from . import db
from .utils import map_scores
from phovea_server.util import jsonify
from phovea_server.security import login_required
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


@app.route('/')
@login_required
def list_database():
  return jsonify([v[0].dump(k) for k,v in db.configs.items()])


@app.route('/<database>')
@login_required
def list_view(database):
  config_engine = db.resolve(database)
  if not config_engine:
    return 404, 'Not Found'
  return jsonify([v.dump(k) for k,v in config_engine[0].views.items()])


@app.route('/<database>/<view_name>')
@login_required
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


def _replace_range_in_ids(v, id_type, target_id_type):
  from phovea_server.dataset import get_mappingmanager, get_idmanager
  from phovea_server.range import parse

  manager = get_idmanager()
  mappingmanager = get_mappingmanager()

  union = set()

  def add_range(r):
    # convert named sets to the primary ids
    uids = parse(r)[0].tolist()
    ids = manager.unmap(uids, id_type)
    if id_type != target_id_type:
      # need to map the ids
      mapped_ids = mappingmanager(id_type, target_id_type, ids)
      for id in mapped_ids:
        if id is not None and len(id) > 0:
          union.add(id[0])  # just the first one for now
    else:
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
      ids = _replace_range_in_ids(v, id_type, view.idtype)
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
    sub_query = view.get_filter_subquery(k)
    return sub_query.format(operator=operator, value=':' + kp)

  for key in where_clause.keys():
    if not view.is_valid_filter(key):
      _log.warn('invalid filter key detected for view "%s" and key "%s"', view.query, key)
      del where_clause[key]

  where_clause = [to_clause(k, v) for k, v in where_clause.items() if len(v) > 0]

  replacements = dict()
  replacements['and_where'] = (' AND ' + ' AND '.join(where_clause)) if where_clause else ''
  replacements['where'] = (' WHERE ' + ' AND '.join(where_clause)) if where_clause else ''

  return replacements, processed_args, extra_args


@app.route('/<database>/<view_name>/filter')
@login_required
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
  replacements, processed_args, extra_args = _filter_logic(view)

  r, view = db.get_data(database, view_name, replacements, processed_args, extra_args)

  if request.args.get('_assignids', False):
    r = db.assign_ids(r, view.idtype)
  return jsonify(r)


@app.route('/<database>/<view_name>/score')
@login_required
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
  replacements, processed_args, extra_args = _filter_logic(view)

  r, view = db.get_data(database, view_name, replacements, processed_args, extra_args)

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
@login_required
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
  replacements, processed_args, extra_args = _filter_logic(view)

  r = db.get_count(database, view_name, replacements, processed_args, extra_args)

  return jsonify(r)


@app.route('/<database>/<view_name>/desc')
@login_required
def get_desc(database, view_name):
  config, engine = db.resolve(database)
  # convert to index lookup
  # row id start with 1
  view = config.views[view_name]

  return jsonify(dict(idType=view.idtype, columns=view.columns.values()))


@app.route('/<database>/<view_name>/lookup')
@login_required
def lookup(database, view_name):
  """
  Does the same job as search, but paginates the result set
  This function is used in conjunction with Select2 form elements
  """
  config, engine = db.resolve(database)
  view = config.views[view_name]

  if view.query is None:
    return jsonify(dict(items=[], more=False))

  arguments = request.args.copy()
  # replace with wildcard version
  arguments['query'] = '%{}%'.format(str(request.args.get('query', '')).lower())

  page = int(request.args.get('page', 0))  # zero based
  limit = int(request.args.get('limit', 30))  # or 'all'
  offset = page * limit
  # add 1 for checking if we have more
  replacements = dict(limit=limit + 1, offset=offset)

  kwargs, replace = db.prepare_arguments(view, config, replacements, arguments)

  with db.session(engine) as session:
    r_items = session.run(view.query.format(**replace), **kwargs)

  more = len(r_items) > limit
  if more:
    # hit the boundary of more remove the artificial one
    del r_items[-1]
  if request.args.get('_assignids', False):
    r_items = db.assign_ids(r_items, view.idtype)
  return jsonify(dict(items=r_items, more=more))


def create():
  """
   entry point of this plugin
  """
  app.debug = True
  return app
