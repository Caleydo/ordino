/// <reference types="react" />
import { EStartMenuMode } from './constants';
import type { IStartMenuTabPlugin } from '../base/extensions';
export interface IStartMenuTabProps {
    /**
     * Flag if the tab is currently active and visible
     */
    isActive: boolean;
}
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
//# sourceMappingURL=interfaces.d.ts.map