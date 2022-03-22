/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */

import React from 'react';
import { CLUEGraphManager, ProvenanceGraph } from 'tdp_core';
import type { IOrdinoApp } from './IOrdinoApp';

// see src/styles/_targid.scss + 100ms delay
export const MODE_ANIMATION_TIME = 500 + 100;

export enum EStartMenuSection {
  /**
   * Main menu section in the header
   */
  MAIN = 'main',

  /**
   * Right menu section in the header
   */
  RIGHT = 'right',
}

export enum EStartMenuMode {
  /**
   * no analysis in the background, the start menu cannot be closed
   */
  START = 'start',

  /**
   * an analysis in the background, the start menu can be closed
   */
  OVERLAY = 'overlay',
}

export enum EStartMenuOpen {
  /**
   * no analysis in the background, the start menu cannot be closed
   */
  OPEN = 'open',

  /**
   * an analysis in the background, the start menu can be closed
   */
  CLOSED = 'closed',
}

export const OrdinoContext = React.createContext<{ app: IOrdinoApp }>({ app: null });

export const GraphContext = React.createContext<{ graph: ProvenanceGraph; manager: CLUEGraphManager }>({ graph: null, manager: null });

export const HighlightSessionCardContext = React.createContext<{ highlight: boolean; setHighlight: React.Dispatch<React.SetStateAction<boolean>> }>({
  highlight: false,
  setHighlight: () => {
    /* dummy function */
  },
});
