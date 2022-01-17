import { ComponentType } from 'react';
export interface ITab {
    id: string;
    Tab: ComponentType;
    name: string;
}
export declare enum EStartMenuMode {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    START = "start",
    /**
     * an analysis in the background, the start menu can be closed
     */
    OVERLAY = "overlay"
}
export declare enum EStartMenuOpen {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    OPEN = "open",
    /**
     * an analysis in the background, the start menu can be closed
     */
    CLOSED = "closed"
}
export interface IStartMenuTabWrapperProps {
    /**
     * List of tabs
     */
    tabs: ITab[];
    /**
     * The currently active (i.e., visible tab)
     * `null` = all tabs are closed
     */
    activeTab: string;
    /**
     * Define the mode of the start menu
     */
    mode: EStartMenuMode;
}
export declare function StartMenuTabWrapper(props: IStartMenuTabWrapperProps): JSX.Element;
