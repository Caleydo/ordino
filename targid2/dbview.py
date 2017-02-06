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

