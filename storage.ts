/**
 * Created by Samuel Gratzl on 11.05.2016.
 */

import ajax = require('../caleydo_core/ajax');
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');
import session = require('../caleydo_core/session');


export interface INamedSet {
  name: string;
  description: string;
  idType: string;
  ids: string;
  creator: string;
}

export function listNamedSets(idType : idtypes.IDType | string = null):Promise<INamedSet[]> {
  const args = idType ? { idType : idtypes.resolve(idType).id} : {};
  return ajax.getAPIJSON('/targid/storage/namedsets/', args);
}

export function saveNamedSet(name: string, idType: idtypes.IDType|string, ids: ranges.RangeLike, description = '') {
  const args:INamedSet = {
    name: name,
    creator: session.retrieve('username', 'Anonymous'),
    idType: idtypes.resolve(idType).id,
    ids: ranges.parse(ids).toString(),
    description: description
  };
  return ajax.sendAPI('/targid/storage/namedsets/', args, 'POST');
}
