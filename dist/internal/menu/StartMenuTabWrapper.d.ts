import React from 'react';
import { EStartMenuMode } from '.';
import { IStartMenuTabPlugin } from '../..';
export interface IStartMenuTabWrapperProps {
    /**
     * List of tabs
     */
    tabs: IStartMenuTabPlugin[];
    /**
     * The currently active (i.e., visible tab)
     * `null` = all tabs are closed
     */
    activeTab: IStartMenuTabPlugin;
    /**
     * Set the active tab
     * `null` closes all tabs
     */
    setActiveTab: React.Dispatch<React.SetStateAction<IStartMenuTabPlugin>>;
    /**
     * Define the mode of the start menu
     */
    mode: EStartMenuMode;
    /**
     * Status of the async loading of the registered plugins
     */
    status: 'idle' | 'pending' | 'success' | 'error';
}
export declare function StartMenuTabWrapper(props: IStartMenuTabWrapperProps): JSX.Element;
