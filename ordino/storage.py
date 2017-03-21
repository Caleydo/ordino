import phovea_server.config
from pymongo import MongoClient
from pymongo.collection import ReturnDocument
from phovea_server.ns import Namespace, request
from phovea_server.util import jsonify
import phovea_server.security as security
import phovea_server.range as ranges
import logging

__author__ = 'Samuel Gratzl'
c = phovea_server.config.view('ordino')
_log = logging.getLogger(__name__)

app = Namespace(__name__)


@app.route('/namedsets/', methods=['GET', 'POST'])
def get_namedsets():
  db = MongoClient(c.host, c.port)[c.database]

  if request.method == 'GET':
    q = dict(idType=request.args['idType']) if 'idType' in request.args else {}
    return jsonify(list(db.namedsets.find(q, {'_id': 0})))

  if request.method == 'POST':
    id = _generate_id()
    name = request.values.get('name', 'NoName')
    creator = request.values.get('creator', security.current_username())
    id_type = request.values.get('idType', '')
    ids = ranges.parse(request.values.get('ids', ''))[0].tolist()
    description = request.values.get('description', '')
    sub_type_key = request.values.get('subTypeKey', '')
    sub_type_value = request.values.get('subTypeValue', '')
    type = int(request.values.get('type', ''))
    entry = dict(id=id, name=name, creator=creator, ids=ids, idType=id_type, description=description,
                 subTypeKey=sub_type_key, subTypeValue=sub_type_value, type=type)
    db.namedsets.insert_one(entry)
    return jsonify(entry)


@app.route('/namedset/<namedset_id>', methods=['GET', 'DELETE', 'PUT'])
def get_namedset(namedset_id):
  if request.method == 'GET':
    return jsonify(get_namedset_by_id(namedset_id))

  if request.method == 'DELETE':
    db = MongoClient(c.host, c.port)[c.database]
    q = dict(id=namedset_id)
    result = db.namedsets.remove(q)
    return jsonify(result['n'])  # number of deleted documents

  if request.method == 'PUT':
    db = MongoClient(c.host, c.port)[c.database]
    filter = dict(id=namedset_id)

    query = {'$set': request.form}

    result = db.namedsets.find_one_and_update(filter, query, return_document=ReturnDocument.AFTER)
    return jsonify(result)

def get_namedset_by_id(namedset_id):
  db = MongoClient(c.host, c.port)[c.database]
  q = dict(id=namedset_id)
  result = list(db.namedsets.find(q, {'_id': 0}))
  if len(result) == 0:
    return {}
  else:
    return result[0]


def _generate_id():
  import phovea_server.util
  return phovea_server.util.fix_id(phovea_server.util.random_id(10))


# @app.route('/delete_legacy_namedsets/', methods=['GET'])
# def delete_legacy_namedsets():
#  db = MongoClient(c.host, c.port)[c.database]
#  result = db.namedsets.remove({'id': {'$exists': False}}) # find all entries without id
#  return jsonify(result['n'])  # number of deleted documents


def create():
  """
   entry point of this plugin
  """
  return app


if __name__ == '__main__':
  app.debug = True
  app.run(host='0.0.0.0')
