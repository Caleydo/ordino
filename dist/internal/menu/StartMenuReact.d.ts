import * as React from 'react';
import { CLUEGraphManager } from 'phovea_clue';
export declare const GraphContext: React.Context<{
    manager: CLUEGraphManager;
}>;
export declare function StartMenuComponent({ headerMainMenu, manager }: {
    headerMainMenu: HTMLElement;
    manager: CLUEGraphManager;
}): JSX.Element;
