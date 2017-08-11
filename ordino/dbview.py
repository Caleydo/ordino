import logging
import re


__author__ = 'Samuel Gratzl'
_log = logging.getLogger(__name__)
REGEX_TYPE = type(re.compile(''))


class DBView(object):
  def __init__(self, idtype=None, query=None):
    self.idtype = idtype
    self.query = query
    self.queries = {}
    self.columns = {}
    self.columns_filled_up = False
    self.replacements = []
    self.valid_replacements = {}
    self.arguments = []
    self.filters = {}
    self.table = None

  def is_valid_filter(self, key):
    if key in self.filters:
      return True
    if key in self.columns:
      return True
    # if not specified and not the columns completed
    return not self.filters and not self.columns_filled_up

  def get_filter_subquery(self, key):
    if key in self.filters and self.filters[key] is not None:
      return self.filters[key]
    if ('filter_' + key) in self.queries:  # compatibility
      return self.queries['filter_' + key]
    return key + ' {operator} {value}'

  def is_valid_replacement(self, key, value):
    if key not in self.replacements:
      return False
    if key not in self.valid_replacements:
      return True
    v = self.valid_replacements[key]
    if isinstance(v, list):
      return value in v
    if v == int or v == float:
      return type(value) == v
    if isinstance(v, REGEX_TYPE):
      return v.match(value)
    _log.info('unknown %s %s %s', key, value, v)
    return True

  def is_valid_argument(self, key):
    return key in self.arguments


class DBViewBuilder(object):
  """
  db view builder pattern implementation
  """
  def __init__(self):
    self.v = DBView()

  def clone(self, view):
    """
    initializes based on a given view
    :param view: the view to copy from
    :return: self
    """
    self.v.idtype = view.idtype
    self.v.query = view.query
    self.v.queries = view.queries.copy()
    self.v.columns = view.columns.copy()
    self.v.replacements = list(view.replacements)
    self.v.arguments = list(view.arguments)
    self.v.filters = view.filters.copy()
    self.v.valid_replacements = view.valid_replacements.copy()
    return self

  def idtype(self, idtype):
    """
    specify the IDType of which the resulting rows are
    :param idtype: the idtype
    :return: self
    """
    self.v.idtype = idtype
    return self

  def table(self, table):
    """
    sets the base table name of this query e.g. for generating queries
    :param table: the table name
    :return: self
    """
    self.v.table = table
    return self

  def query(self, key, query=None):
    """
    sets or adds another query to this builder
    :param key: optional the key of this query if not given the default query will be set
    :param query: the sql query
    :return: self
    """
    if query is None:
      query = key
      self.v.query = query
    else:
      self.v.queries[key] = query
    return self

  def filters(self, *keys):
    """
    specify possible filter keys
    :param keys: the list of possible filters
    :return:
    """
    for key in keys:
      if isinstance(key, list):
        for kkey in key:
          self.v.filters[kkey] = None
      else:
        self.v.filters[key] = None
    return self

  def filter(self, key, replacement=None, alias=None, table=None):
    """
    add a possible filter with replacement strategy of type {key} {operator} {value}
    :param key: filter key
    :param replacement: optional the full replacement string has to inclue {operator} and {value}
    :param alias: shortcut for just specifying the left hand alias: {alias} {operator} {value}
    :param table: shortuct for just specifying the table alias: {table}.{key} {operator} {value}
    :return: self
    """
    if table is not None:
      alias = '{}.{}'.format(table, key)
    if alias is not None:
      replacement = alias + ' {operator} {value}'
    self.v.filters[key] = replacement
    return self

  def append(self, key, query=None):
    """
    append something to the query
    :param key: optional key
    :param query: the subpart to append
    :return: self
    """
    if query is None:
      query = key
      self.v.query += query
    else:
      self.v.queries[key] += query
    return self

  def query_stats(self, query):
    """
    shortcut for query('stats', query)
    :param query: the query
    :return: self
    """
    self.v.queries['stats'] = query
    return self

  def query_categories(self, query):
    """
    shortcut for query('categories', query)
    :param query: the query
    :return: self
    """
    self.v.queries['categories'] = query
    return self

  def column(self, name, **kwargs):
    """
    specify a column along with a type for the result
    :param name: name of column
    :param kwargs: additional attributes such as label and type
    :return: self
    """
    if 'label' not in kwargs:
      kwargs['label'] = name
    self.v.columns[name] = kwargs
    return self

  def replace(self, replace, valid_replacements=None):
    """
    specify to replace a certain piece of the query (using {replace}) within the query
    :param replace: the key to replace
    :param valid_replacements: optional validation to avoid SQL injection, possible values: a list of strings, a regex, int or float
    :return: self
    """
    self.v.replacements.append(replace)
    if valid_replacements is not None:
      self.v.valid_replacements[replace] = valid_replacements
    return self

  def arg(self, arg):
    """
    adds another argument of this query (using :arg) which will be replaced within SQL
    :param arg: the argument key
    :return: self
    """
    self.v.arguments.append(arg)
    return self

  def call(self, f):
    """
    shortcut for f(self)
    :param f: the function to call
    :return: self
    """
    f(self)
    return self

  def build(self):
    """
    builds the query and end this builder
    :return: the built query
    """
    return self.v


def limit_offset(builder):
  """
  helper function to append the limit and offset suffix
  :param builder: the current query builder
  :return:
  """
  return builder.append(' LIMIT {limit} OFFSET {offset}') \
    .replace('limit', int).replace('offset', int) \
    .arg('query')


def append_where(builder):
  """
  helper function to append to the query the generated where clause
  :param builder: the current builder
  :return:
  """
  query = builder.v.query
  if ' where ' in query.lower():
    return builder.query(query + ' {and_where}').replace('and_where')
  else:
    return builder.query(query + ' {where}').replace('where')


def add_common_queries(queries, table, idtype, id_query, columns = None):
  """
  create a set of common queries
  :param queries: dict where the queries should be stored
  :param table: base table name
  :param idtype: idtype of the table
  :param id_query: the snipplet to create the required 'id' column
  :param columns: a list of columns for validation
  :return: None
  """
  queries[table] = DBViewBuilder().idtype(idtype).table(table).query("""
          SELECT {id}, * FROM {table}""".format(id=id_query, table=table)).build()

  queries[table + '_items'] = DBViewBuilder().idtype(idtype).table(table).query("""
        SELECT {id}, {{column}} AS text
        FROM {table} WHERE LOWER({{column}}) LIKE :query
        ORDER BY {{column}} ASC""".format(id=id_query, table=table)) \
    .replace('column', columns).call(limit_offset) \
    .arg('query').build()

  queries[table + '_items_verify'] = DBViewBuilder().idtype(idtype).table(table).query("""
        SELECT {id}, {table}_name AS text
        FROM {table}""".format(id=id_query,table=table))\
    .call(append_where).build()

  queries[table + '_unique'] = DBViewBuilder().query("""
        SELECT d as id, d as text
        FROM (
          SELECT distinct {{column}} AS d
          FROM {table} WHERE LOWER({{column}}) LIKE :query
          ) as t
        ORDER BY d ASC LIMIT {{limit}} OFFSET {{offset}}""".format(table=table)) \
    .replace('column', columns).replace('limit', int).replace('offset', int) \
    .arg('query').build()

  queries[table + '_unique_all'] = DBViewBuilder().query("""
        SELECT distinct {{column}} AS text
        FROM {table} ORDER BY {{column}} ASC """.format(table=table)) \
    .replace('column', columns).build()


"""
 default aggregation
"""
default_agg_score = DBViewBuilder().query('{agg}({data_subtype})') \
    .replace('agg', ['min', 'max', 'avg']).replace('data_subtype').build()


class DBMapping(object):
  """
  simple mapping based on a query which
  """
  def __init__(self, from_idtype, to_idtype, query):
    self.from_idtype = from_idtype
    self.to_idtype = to_idtype
    self.query = query


class DBConnector(object):
  """
  basic connector object
  """
  def __init__(self, views, agg_score = None, mappings=None):
    """
    :param views: the dict of query views
    :param agg_score: optional specify how aggregation should be handled
    :param mappings: optional database mappings
    """
    self.agg_score = agg_score or default_agg_score
    self.views = views
    self.dburl = None
    self.mappings = mappings
    self.statement_timeout = None
    self.statement_timeout_query = None
