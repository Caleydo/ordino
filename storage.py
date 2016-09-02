__author__ = 'Samuel Gratzl'

import caleydo_server.config
c = caleydo_server.config.view('targid2')

from pymongo import MongoClient
from flask import Flask, request, abort
from caleydo_server.util import jsonify
import caleydo_server.security as security
import caleydo_server.range as ranges

import logging
_log = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/namedsets/', methods=['GET', 'POST'])
def get_namedsets():
  db = MongoClient(c.host, c.port)[c.database]
  if request.method == 'GET':
    q = dict(idType=request.args['idType']) if 'idType' in request.args else {}
    return jsonify(list(db.namedsets.find(q, { '_id': 0})))
  if request.method == 'POST':
    name = request.values.get('name', 'NoName')
    creator = request.values.get('creator', security.current_username())
    id_type = request.values.get('idType','')
    ids = ranges.parse(request.values.get('ids', ''))[0].tolist()
    description = request.values.get('description', '')
    subTypeKey = request.values.get('subTypeKey', '')
    subTypeValue = request.values.get('subTypeValue', '')
    entry = dict(name=name,creator=creator,ids=ids,idType=id_type,description=description,subTypeKey=subTypeKey,subTypeValue=subTypeValue)
    db.namedsets.insert_one(entry)
    return jsonify(entry)

def create():
  """
   entry point of this plugin
  """
  return app


if __name__ == '__main__':
  app.debug = True
  app.run(host='0.0.0.0')
