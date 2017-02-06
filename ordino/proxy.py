from phovea_server.ns import Namespace, Response, request, abort
import requests

__author__ = 'Samuel Gratzl'

app = Namespace(__name__)


def _to_site_url(site):
  import phovea_server.plugin

  proxy_defs = phovea_server.plugin.list('targid_proxy')
  for p in proxy_defs:
    if p.id == site:
      return p.url.format(**request.args.to_dict())
  # none matching found
  return None


@app.route('/<site>')
def get_details(site):
  import logging
  _log = logging.getLogger(__name__)

  url = _to_site_url(site)
  if url:
    _log.info('proxy request url: %s', url)
    r = requests.get(url)
    _log.info('proxy response status code: %s', r.status_code)
    return Response(r.text, status=r.status_code, content_type=r.headers['content-type'])
  abort(404)


def create():
  return app


if __name__ == '__main__':
  app.debug = True
  app.run(host='0.0.0.0')
