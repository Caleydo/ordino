/**
 * Created by Samuel Gratzl on 11.05.2016.
 */

import {getAPIJSON, sendAPI} from 'phovea_core/src/ajax';
import {IDType, resolve} from 'phovea_core/src/idtype';
import {parse, RangeLike} from 'phovea_core/src/range';
import {
  currentUserNameOrAnonymous, ALL_READ_NONE, ISecureItem, ALL_READ_READ,
  ALL_NONE_NONE, EEntity, hasPermission
} from 'phovea_core/src/security';
import {FormDialog, generateDialog} from "phovea_ui/src/dialogs";
import {ISecureItem, currentUserNameOrAnonymous} from 'phovea_core/src/security';

export enum ENamedSetType {
  NAMEDSET, CUSTOM, PANEL, FILTER
}

export interface INamedSet extends ISecureItem {
  /**
   * Id with random characters (generated when storing it on the server)
   */
  id?: string;


export interface IBaseNamedSet {
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
   * Name of a categorical column (e.g., species)
   */
  subTypeKey?: string;

  /**
   * Value of the categorical column (e.g., "Homo_sapiens" as value for species)
   */
  subTypeValue?: string;

  /**
   * Use the subType value for the given key from the session
   */
  subTypeFromSession?: boolean;
}

export interface IPanelNamedSet extends IBaseNamedSet {
  type: ENamedSetType.PANEL;
  id: string;
}
export interface IStoredNamedSet extends IBaseNamedSet, ISecureItem {
  type: ENamedSetType.NAMEDSET;

  /**
   * Id with random characters (generated when storing it on the server)
   */
  id: string;

  /**
   * List of comma separated ids
   */
  ids: string;
}

export interface IFilterNamedSet extends IBaseNamedSet {
  type: ENamedSetType.FILTER;

  filter: {[key: string]: any};
}
export interface ICustomNamedSet extends IBaseNamedSet {
  type: ENamedSetType.CUSTOM;
}

export declare type INamedSet = IFilterNamedSet | IPanelNamedSet | IStoredNamedSet | ICustomNamedSet;

export function listNamedSets(idType : IDType | string = null):Promise<IStoredNamedSet[]> {
  const args = idType ? { idType : resolve(idType).id} : {};
  return getAPIJSON('/targid/storage/namedsets/', args).then((sets: IStoredNamedSet[]) => {
    // default value
    sets.forEach((s) => s.type = s.type || ENamedSetType.NAMEDSET);
    return sets;
  });
}

export function listNamedSetsAsOptions(idType : IDType | string = null) {
  return listNamedSets(idType).then((namedSets) => namedSets.map((d) => ({name: d.name, value: d.id})));
}

export function saveNamedSet(name: string, idType: IDType|string, ids: RangeLike, subType: {key:string, value:string}, description = '', isPublic: boolean = false) {
  const data = {
    name,
    type: ENamedSetType.NAMEDSET,
    creator: currentUserNameOrAnonymous(),
    permissions: isPublic ? ALL_READ_READ : ALL_READ_NONE,
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

export function editNamedSet(id:string, data: {[key: string]: any}) {
  return sendAPI(`/targid/storage/namedset/${id}`, data, 'PUT');
}

export function editDialog(namedSet: IStoredNamedSet, result: (name: string, description: string, isPublic: boolean)=>void) {
  const isCreate = namedSet === null;
  const title = isCreate ? 'Save' : 'Edit';
  const dialog = new FormDialog(title+' Named Set', title, 'namedset_form');

  dialog.form.innerHTML = `
    <div class="form-group">
      <label for="namedset_name">Name</label>
      <input type="text" class="form-control" id="namedset_name" placeholder="Name" required="required" ${namedSet ? `value="${namedSet.name}"`:''}>
    </div>
    <div class="form-group">
      <label for="namedset_description">Description</label>
      <textarea class="form-control" id="namedset_description" rows="5" placeholder="Description">${namedSet ? namedSet.description: ''}</textarea>
    </div>
    <div class="checkbox">
      <label>
        <input type="checkbox" id="namedset_public" ${namedSet && hasPermission(namedSet, EEntity.OTHERS) ? 'checked="checked"' : ''}> Public (everybody can see and use it)
      </label>
    </div>
  `;

  dialog.onHide(() => dialog.destroy());

  dialog.onSubmit(() => {
    const name = (<HTMLInputElement>document.getElementById('namedset_name')).value;
    const description = (<HTMLInputElement>document.getElementById('namedset_description')).value;
    const isPublic = (<HTMLInputElement>document.getElementById('namedset_public')).checked;

    result(name, description, isPublic);
    dialog.hide();
  });

  dialog.show();
}
