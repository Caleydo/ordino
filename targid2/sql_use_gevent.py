"""
based on http://www.jasonamyers.com/gevent-postgres-sqlalchemy
try to parallelize psycopg2 for gevent
"""
import logging

__author__ = 'Samuel Gratzl'
_log = logging.getLogger(__name__)


def make_psycopg_green():
  """Configure Psycopg to be used with gevent in non-blocking way."""
  if not hasattr(extensions, 'set_wait_callback'):
    raise ImportError(
      'support for coroutines not available in this Psycopg version (%s)'
      % psycopg2.__version__)

  extensions.set_wait_callback(gevent_wait_callback)


def gevent_wait_callback(conn, timeout=None):
  """A wait callback useful to allow gevent to work with Psycopg."""
  while True:
    state = conn.poll()
    if state == extensions.POLL_OK:
      break
    elif state == extensions.POLL_READ:
      wait_read(conn.fileno(), timeout=timeout)
    elif state == extensions.POLL_WRITE:
      wait_write(conn.fileno(), timeout=timeout)
    else:
      raise psycopg2.OperationalError(
        'Bad result from poll: %r' % state)


try:
  import psycopg2
  from psycopg2 import extensions

  from gevent.socket import wait_read, wait_write

  _log.info('patching psycopg2 to be green')
  make_psycopg_green()
except ImportError:
  pass  # nothing to do
