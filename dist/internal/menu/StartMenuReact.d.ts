import * as React from 'react';
import { OrdinoApp } from '../..';
export declare const AppContext: React.Context<{
    app: OrdinoApp;
}>;
export declare function StartMenuComponent({ headerMainMenu, app }: {
    headerMainMenu: HTMLElement;
    app: OrdinoApp;
}): JSX.Element;
