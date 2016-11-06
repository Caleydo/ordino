__author__ = 'Holger Stitz'

from phovea_server.ns import Namespace, request, abort


import logging
_log = logging.getLogger(__name__)

app = Namespace(__name__)

@app.route('/sub/<x>/<y>', methods=['GET'])
def add(x, y):
  import tasks
  res = tasks.sub.apply_async((x, y))
  return "<a href=\"/api/processing/res/" + res.id + "\">" + res.id + "</a>"



def create():
  """
   entry point of this plugin
  """
  return app


if __name__ == '__main__':
  app.debug = True
  app.run(host='0.0.0.0')
