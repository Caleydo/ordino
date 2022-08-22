/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */
import React from 'react';
// see src/styles/_targid.scss + 100ms delay
export const MODE_ANIMATION_TIME = 500 + 100;
export var EStartMenuSection;
(function (EStartMenuSection) {
    /**
     * Main menu section in the header
     */
    EStartMenuSection["MAIN"] = "main";
    /**
     * Right menu section in the header
     */
    EStartMenuSection["RIGHT"] = "right";
})(EStartMenuSection || (EStartMenuSection = {}));
export var EStartMenuMode;
(function (EStartMenuMode) {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    EStartMenuMode["START"] = "start";
    /**
     * an analysis in the background, the start menu can be closed
     */
    EStartMenuMode["OVERLAY"] = "overlay";
})(EStartMenuMode || (EStartMenuMode = {}));
export var EStartMenuOpen;
(function (EStartMenuOpen) {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    EStartMenuOpen["OPEN"] = "open";
    /**
     * an analysis in the background, the start menu can be closed
     */
    EStartMenuOpen["CLOSED"] = "closed";
})(EStartMenuOpen || (EStartMenuOpen = {}));
export const OrdinoContext = React.createContext({ app: null });
export const GraphContext = React.createContext({ graph: null, manager: null });
export const HighlightSessionCardContext = React.createContext({
    highlight: false,
    setHighlight: () => {
        /* dummy function */
    },
});
//# sourceMappingURL=constants.js.map