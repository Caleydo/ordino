/**
 * Created by Samuel Gratzl on 16.12.2015.
 */

import vis = require('../caleydo_core/vis');
import vector = require('../caleydo_core/vector');
import tables = require('../caleydo_core/table_impl');

function convertToTable(data: vector.IVector) {
  return tables.fromVectors({
    id: 'test',
    type: 'table',
    name: 'test',
    fqname: 'test'
  },[data]);
}

export function create(data: vector.IVector, parent: Element) {
  const table = convertToTable(data);
  var lineup = vis.list(table).filter((v) => v.id === 'caleydo-vis-lineup')[0];
  return lineup.load().then((p) => p.factory(table, parent, {
    rowNames: true
  }));
}
