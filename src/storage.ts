/**
 * Created by Samuel Gratzl on 11.05.2016.
 */

import {getAPIJSON, sendAPI} from 'phovea_core/src/ajax';
import {IDType, resolve} from 'phovea_core/src/idtype';
import {parse, RangeLike} from 'phovea_core/src/range';
import {retrieve} from 'phovea_core/src/session';
import {ISecureItem, currentUserNameOrAnonymous} from 'phovea_core/src/security';

export enum ENamedSetType {
  NAMEDSET, CUSTOM, PANEL
}

export interface INamedSet extends ISecureItem {
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

export function listNamedSets(idType : IDType | string = null):Promise<INamedSet[]> {
  const args = idType ? { idType : resolve(idType).id} : {};
  return getAPIJSON('/targid/storage/namedsets/', args).then((sets: INamedSet[]) => {
    // default value
    sets.forEach((s) => s.type = s.type || ENamedSetType.NAMEDSET);
    return sets;
  });
}

export function listNamedSetsAsOptions(idType : IDType | string = null) {
  return listNamedSets(idType).then((namedSets) => namedSets.map((d) => ({name: d.name, value: d.id})));
}

export function saveNamedSet(name: string, idType: IDType|string, ids: RangeLike, subType: {key:string, value:string}, description = '') {
  const data:INamedSet = {
    name,
    type: ENamedSetType.NAMEDSET,
    creator: currentUserNameOrAnonymous(),
    idType: resolve(idType).id,
    ids: parse(ids).toString(),
    subTypeKey: subType.key,
    subTypeValue: subType.value,
    description
  };
  return sendAPI('/targid/storage/namedsets/', data, 'POST');
}

export function deleteNamedSet(id:string) {
  return sendAPI(`/targid/storage/namedset/${id}`, {}, 'DELETE');
}

export function editNamedSet(id:string, data: {[key: string]: string}) {
  return sendAPI(`/targid/storage/namedset/${id}`, data, 'PUT');
}
