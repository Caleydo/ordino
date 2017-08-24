import {IPlugin, IPluginDesc} from 'phovea_core/src/plugin';
import IDType from 'phovea_core/src/idtype/IDType';
import {INamedSet} from 'tdp_core/src/storage';

export const EXTENSION_POINT_START_MENU = 'targidStartMenuSection';


export interface IStartMenuSectionDesc extends IPluginDesc {
  readonly name: string;
  readonly cssClass: string;

  load(): Promise<IStartMenuSectionPlugin>;
}


export interface IStartMenuSectionOptions {
  session?(viewId: string, options: {namedSet: INamedSet}, defaultSessionValues: any): void;
}

interface IStartMenuSectionPlugin {
  desc: IStartMenuSectionDesc;

  factory(parent: HTMLElement, desc: IStartMenuSectionDesc, options: IStartMenuSectionOptions): IStartMenuSection;
}

export interface IEntryPointList {
  getIdType(): IDType | string;

  push(namedSet: INamedSet): void;

  remove(namedSet: INamedSet): void;

  replace(oldNamedSet: INamedSet, newNamedSet: INamedSet): void;

  update(): void;
}

export interface IStartMenuSection {
  readonly desc: IPluginDesc;

  getEntryPointLists(): IEntryPointList[];
}
