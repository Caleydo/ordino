__author__ = 'Samuel Gratzl'

from flask import Flask, Response, request
import requests

app = Flask(__name__)

def _to_site_url(site):
  import caleydo_server.plugin

  proxy_defs = caleydo_server.plugin.list('targid_proxy')
  for p in proxy_defs:
    if p.id == site:
      return p.url.format(request.args)
  #none matching found
  return None

@app.route('/<site>')
def get_details(site):
  url = _to_site_url(site)
  if url:
    r = requests.get(url)
    return Response(r.text, status=r.status_code, content_type=r.headers['content-type'])
  return 404

def create():
  return app

if __name__ == '__main__':
  app.debug = True
  app.run(host='0.0.0.0')
