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
    id = _generate_id()
    name = request.values.get('name', 'NoName')
    creator = request.values.get('creator', security.current_username())
    id_type = request.values.get('idType','')
    ids = ranges.parse(request.values.get('ids', ''))[0].tolist()
    description = request.values.get('description', '')
    subTypeKey = request.values.get('subTypeKey', '')
    subTypeValue = request.values.get('subTypeValue', '')
    entry = dict(id=id,name=name,creator=creator,ids=ids,idType=id_type,description=description,subTypeKey=subTypeKey,subTypeValue=subTypeValue)
    db.namedsets.insert_one(entry)
    return jsonify(entry)


@app.route('/namedset/<namedsetId>', methods=['GET', 'DELETE'])
def get_namedset(namedsetId):

  if request.method == 'GET':
    return jsonify(get_namedsetById(namedsetId))

  if request.method == 'DELETE':
    db = MongoClient(c.host, c.port)[c.database]
    q = dict(id=namedsetId)
    result = db.namedsets.remove(q)
    return jsonify(result['n']) # number of deleted documents


def get_namedsetById(namedsetId):
  db = MongoClient(c.host, c.port)[c.database]
  q = dict(id=namedsetId)
  result = list(db.namedsets.find(q, {'_id': 0}))
  if len(result) == 0:
    return {}
  else:
    return result[0]

def _generate_id():
  import caleydo_server.util
  return caleydo_server.util.fix_id(caleydo_server.util.random_id(10))


@app.route('/delete_legacy_namedsets/', methods=['GET'])
def delete_legacy_namedsets():
  db = MongoClient(c.host, c.port)[c.database]
  result = db.namedsets.remove({'id': {'$exists': False}}) # find all entries without id
  return jsonify(result['n'])  # number of deleted documents


def create():
  """
   entry point of this plugin
  """
  return app


if __name__ == '__main__':
  app.debug = True
  app.run(host='0.0.0.0')
