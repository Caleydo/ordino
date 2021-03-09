import * as React from 'react';
import { IOrdinoOptions, OrdinoApp } from '../..';
import { AppHeader } from 'phovea_ui';
export declare type StartMenuMode = 'start' | 'overlay';
export declare const OrdinoAppContext: React.Context<{
    app: OrdinoApp;
}>;
export declare function StartMenuComponent({ header, app, options, modePromise }: {
    header: AppHeader;
    app: OrdinoApp;
    options: IOrdinoOptions;
    modePromise: Promise<StartMenuMode>;
}): JSX.Element;
