import {IPluginDesc} from 'phovea_core/src/plugin';
import {INamedSet} from 'tdp_core/src/storage';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';

export const EXTENSION_POINT_START_MENU = 'ordinoStartMenuSection';


export interface IStartMenuSectionDesc extends IPluginDesc {
  readonly name: string;
  readonly cssClass: string;

  load(): Promise<IStartMenuSectionPlugin>;
}

export interface IStartMenuSectionOptions {
  session?(viewId: string, options: {namedSet?: INamedSet, [key: string]: any}, defaultSessionValues: any): void;
  graphManager: CLUEGraphManager;
}

interface IStartMenuSectionPlugin {
  desc: IStartMenuSectionDesc;

  factory(parent: HTMLElement, desc: IStartMenuSectionDesc, options: IStartMenuSectionOptions): IStartMenuSection;
}

export interface IStartMenuSection {
  readonly desc: IPluginDesc;

  push(namedSet: INamedSet): boolean;
  update?(): void;
}
