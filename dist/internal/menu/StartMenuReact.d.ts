import * as React from 'react';
import { OrdinoApp } from '../..';
import { AppHeader } from 'phovea_ui';
export declare type StartMenuMode = 'start' | 'overlay';
export declare const OrdinoAppContext: React.Context<{
    app: OrdinoApp;
}>;
export declare function StartMenuComponent({ header, app, modePromise }: {
    header: AppHeader;
    app: OrdinoApp;
    modePromise: Promise<StartMenuMode>;
}): JSX.Element;
