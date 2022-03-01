import logging
from itertools import islice
import redis
import time
import redis
from cachelib import SimpleCache
from .config import config

_log = logging.getLogger(__name__)


def ascii(s):
  return s


def wait_for_redis_ready(db, timeout=5) -> bool:

  _log.info('check if redis is ready')
  start_time = time.time()
  while timeout is None or time.time() - start_time < timeout:
    try:
      db.dbsize()
    except (redis.exceptions.BusyLoadingError, redis.exceptions.ConnectionError):
      _log.info('stall till redis is ready')
      time.sleep(0.5)
    else:
      # Return true if we managed to get a valid response
      return True
  # If we time out, return false
  return False



class RedisIDAssigner(object):
  """
  assigns ids to object using a redis database
  """

  def __init__(self):

    self._db = redis.Redis(host=config['assigner']['hostname'], port=config['assigner']['port'], db=config['assigner']['db'], charset='utf-8', decode_responses=True, **config['assigner']['extras'])
    if not wait_for_redis_ready(self._db):
      raise Exception('Redis is not ready')
    self._cache = SimpleCache(threshold=config['assigner']['cache'])

  @staticmethod
  def to_forward_key(idtype, identifier):
    return ascii(idtype + '2id.' + str(identifier))

  @staticmethod
  def from_forward_key(idtype, forward_key):
    prefix = idtype + '2id.'
    return forward_key[len(prefix):]

  @staticmethod
  def to_backward_key(idtype, id):
    return ascii('id2' + idtype + '.' + str(id))

  def _get_entry(self, key):
    r = self._cache.get(key)
    if r is not None:  # cached
      return r
    r = self._db.get(key)  # lookup in db
    if r is not None:  # cache if found
      self._cache.set(key, r)
    return r

  def _get_entries(self, keys):
    result = []
    not_cached = []
    not_cached_indices = []
    for i, k in enumerate(keys):
      cached = self._cache.get(k)
      result.append(cached)
      if cached is None:
        not_cached.append(k)
        not_cached_indices.append(i)

    if len(not_cached) > 0:
      values = self._db.mget(not_cached)
      for k, i, v in zip(not_cached, not_cached_indices, values):
        if v:
          self._cache.set(k, v)
          result[i] = v
    return result

  def unmap(self, uids, idtype):
    return self._get_entries((self.to_backward_key(idtype, id) for id in uids))

  def load(self, idtype, mapping):
    """
    resets and loads the given mapping
    :param idtype:
    :param mapping: array of tuples (id, uid)
    :return:
    """

    # assuming incremental ids
    if idtype in self._db:
      _log.info('clearing %s', idtype)
      self._cache.clear()
      forward_keys = self._db.keys(idtype + '2id.*')
      _log.debug('found %d forward keys', len(forward_keys))
      self._db.delete(forward_keys)
      backward_keys = self._db.keys('id2' + idtype + '.*')
      _log.debug('found %d backwards keys', len(backward_keys))
      self._db.delete(backward_keys)
      _log.debug('deleted %d keys', len(backward_keys) + len(forward_keys))
      del self._db[idtype]

    if len(mapping) == 0:
      return  # no mappings to load

    max_uid = None
    pipe = self._db.pipeline()

    _log.info('%s loading %s keys', idtype, len(mapping))
    for id, uid in mapping:
      key = self.to_forward_key(idtype, id)
      max_uid = uid if max_uid is None else max(uid, max_uid)
      pipe.set(key, uid)
      pipe.set(self.to_backward_key(idtype, uid), str(id))

    pipe.set(idtype, max_uid)
    _log.debug('flushing')

    pipe.execute()
    _log.debug('flushed')

  def __call__(self, ids, idtype):
    """
     return the integer index ids for the given ids in the given idtype
    """
    idtype = ascii(idtype)
    if not isinstance(ids, list):
      ids = list(ids)  # maybe a generator

    before = int(self._db.get(idtype) if idtype in self._db else self._db.decr(idtype))  # initialize with -1
    entries = self._get_entries((self.to_forward_key(idtype, id) for id in ids))

    def create_entry(i, entry):
      if entry is None:
        id = ids[i]
        key = self.to_forward_key(idtype, id)
        entry = self._db.incr(idtype)
        self._db.set(key, entry)
        self._cache.set(key, entry)
        back_key = self.to_backward_key(idtype, entry)
        self._db.set(back_key, str(id))
        self._cache.set(back_key, str(id))
      return entry

    r = [int(create_entry(i, entry)) for i, entry in enumerate(entries)]

    after = int(self._db.get(idtype))
    if before != after:
      _log.debug('create %s %d!=%d', idtype, before, after)

    return r

  def search(self, idtype, query, max_results=None):
    """
    searches for matches in the names of the given idtype
    :param idtype:
    :param query:
    :param max_results
    :return:
    """
    query = ''.join(('[' + lower + upper + ']' for lower, upper in zip(query.upper(), query.lower())))
    match = self.to_forward_key(idtype, '*' + query + '*')
    keys = [k for k in islice(self._db.scan_iter(match=match), max_results)]
    ids = self._get_entries(keys)
    return [dict(id=int(id), name=self.from_forward_key(idtype, key)) for key, id in zip(keys, ids)]
