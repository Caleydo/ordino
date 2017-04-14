__author__ = 'Samuel Gratzl'


class DBView(object):
  def __init__(self, idtype=None, query=None):
    self.idtype = idtype
    self.query = query
    self.queries = {}
    self.columns = {}
    self.replacements = []
    self.arguments = []


class DBViewBuilder(object):
  def __init__(self):
    self.v = DBView()

  def clone(self, view):
    self.v.idtype = view.idtype
    self.v.query = view.query
    self.v.queries = view.queries.copy()
    self.v.columns = view.columns.copy()
    self.v.replacements = list(view.replacements)
    self.v.arguments = list(view.arguments)
    return self

  def idtype(self, idtype):
    self.v.idtype = idtype
    return self

  def query(self, label, query=None):
    if query is None:
      query = label
      self.v.query = query
    else:
      self.v.queries[label] = query
    return self

  def append(self, label, query=None):
    if query is None:
      query = label
      self.v.query += query
    else:
      self.v.queries[label] += query
    return self

  def query_stats(self, query):
    self.v.queries['stats'] = query
    return self

  def query_categories(self, query):
    self.v.queries['categories'] = query
    return self

  def column(self, name, **kwargs):
    if 'label' not in kwargs:
      kwargs['label'] = name
    self.v.columns[name] = kwargs
    return self

  def replacements(self, replacements):
    self.v.replacements = replacements
    return self

  def replace(self, replace):
    self.v.replacements.append(replace)
    return self

  def arguments(self, arguments):
    self.v.arguments = arguments
    return self

  def arg(self, arg):
    self.v.arguments.append(arg)
    return self

  def build(self):
    return self.v


class DBMapping(object):
  def __init__(self, from_idtype, to_idtype, query):
    self.from_idtype = from_idtype
    self.to_idtype = to_idtype
    self.query = query


class DBConnector(object):
  def __init__(self, agg_score, views, mappings=None):
    self.agg_score = agg_score
    self.views = views
    self.dburl = None
    self.mappings = mappings
    self.statement_timeout = None
