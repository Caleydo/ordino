/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/

import {IPluginDesc} from 'phovea_core';
import {INamedSet} from 'tdp_core';
import {CLUEGraphManager} from 'phovea_clue';
import {IStartMenuSectionTab} from '../internal/menu/tabs/DatasetsTab';

export const EXTENSION_POINT_START_MENU = 'ordinoStartMenuSection';


export interface IStartMenuSectionDesc extends IPluginDesc {
  readonly name: string;
  /**
   * TODO See if cssClass is still necessary in session cards.
   */
  readonly cssClass: string;
  readonly faIcon: string;
  load(): Promise<IStartMenuSectionPlugin>;
}

export interface IStartMenuSectionOptions {
  session?(viewId: string, options: {namedSet?: INamedSet, [key: string]: any}, defaultSessionValues: any): void;

  graphManager: CLUEGraphManager;
}

interface IStartMenuSectionPlugin {
  desc: IStartMenuSectionDesc;

  factory(props: IStartMenuSectionDesc): JSX.Element;
}

export interface IStartMenuSection {
  readonly desc: IPluginDesc;

  push(namedSet: INamedSet): boolean;

  update?(): void;
}


export const EP_ORDINO_STARTMENU_DATASET = 'epOrdinoStartMenuDataset';

export interface IStartMenuDatasetDesc extends IPluginDesc {
  id: string;
  name: string;
  headerIcon: string;
  viewId: string;
  tabs: IStartMenuSectionTab[];

  load(): Promise<IStartMenuDatasetPlugin>;
}

interface IStartMenuDatasetPlugin {
  desc: IStartMenuDatasetDesc;

  factory(props: IStartMenuDatasetDesc): JSX.Element;
}

export interface IStartMenuDataset {
  push(namedSet: INamedSet): boolean;
  update(): void;
}
