/**
 * Created by Samuel Gratzl on 11.05.2016.
 */

import ajax = require('../caleydo_core/ajax');
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');
import session = require('../caleydo_core/session');

export enum ENamedSetType {
  NAMEDSET, CUSTOM, PANEL
}

export interface INamedSet {
  /**
   * Id with random characters (generated when storing it on the server)
   */
  id?: string;

  /**
   * type of the named set
   */
  type: ENamedSetType;

  /**
   * Filter name
   */
  name: string;

  /**
   * Filter description
   */
  description: string;

  /**
   * Creator name
   */
  creator: string;

  /**
   * idtype name to match the filter for an entry point
   */
  idType: string;

  /**
   * List of comma separated ids
   */
  ids: string;

  /**
   * Name of a categorical column (e.g., species)
   */
  subTypeKey: string;

  /**
   * Value of the categorical column (e.g., "Homo_sapiens" as value for species)
   */
  subTypeValue: string;

  /**
   * Use the subType value for the given key from the session
   */
  subTypeFromSession?: boolean;
}

export function listNamedSets(idType : idtypes.IDType | string = null):Promise<INamedSet[]> {
  const args = idType ? { idType : idtypes.resolve(idType).id} : {};
  return ajax.getAPIJSON('/targid/storage/namedsets/', args).then((sets: INamedSet[]) => {
    sets.forEach((s) => s.type = s.type || ENamedSetType.NAMEDSET);
    sets = sets.filter((d) => d.creator === session.retrieve('username'));
    return sets;
  });
}

export function saveNamedSet(name: string, idType: idtypes.IDType|string, ids: ranges.RangeLike, subType: {key:string, value:string}, description = '') {
  const data:INamedSet = {
    name: name,
    type: ENamedSetType.NAMEDSET,
    creator: session.retrieve('username', 'Anonymous'),
    idType: idtypes.resolve(idType).id,
    ids: ranges.parse(ids).toString(),
    subTypeKey: subType.key,
    subTypeValue: subType.value,
    description: description
  };
  return ajax.sendAPI('/targid/storage/namedsets/', data, 'POST');
}

export function deleteNamedSet(id:string) {
  return ajax.sendAPI(`/targid/storage/namedset/${id}`, {}, 'DELETE');
}
