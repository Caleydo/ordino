import logging
from . import db
import itertools

_log = logging.getLogger(__name__)


class SQLMappingTable(object):
  def __init__(self, mapping, engine):
    self.from_idtype = mapping.from_idtype
    self.to_idtype = mapping.to_idtype
    self._engine = engine
    self._query = mapping.query

  def __call__(self, ids):
    with db.session(self._engine) as session:
      mapped = session.execute(self._query, ids=ids)

      # handle multi mappings
      data = sorted(mapped, key=lambda x: x['f'])
      grouped = {k: list(g) for k, g in itertools.groupby(data, lambda x: x['f'])}
      return [grouped.get(id, []) for id in ids]


def _discover_mappings():
  for (connector, engine) in db.configs.values():
    if not connector.mappings:
      continue
    for mapping in connector.mappings:
      _log.info('registering %s to %s', mapping.from_idtype, mapping.to_idtype)
      yield SQLMappingTable(mapping, engine)


class SQLMappingProvider(object):
  def __init__(self):
    self._mappings = list(_discover_mappings())

  def __iter__(self):
    return iter(((f.from_idtype, f.to_idtype, f) for f in self._mappings))


def create():
  return SQLMappingProvider()
