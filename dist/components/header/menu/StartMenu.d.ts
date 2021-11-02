import { ETabStates } from '../../..';
export declare enum EStartMenuSection {
    /**
     * Main menu section in the header
     */
    MAIN = "main",
    /**
     * Right menu section in the header
     */
    RIGHT = "right"
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
export interface IStartMenuTabProps {
    /**
     * Flag if the tab is currently active and visible
     */
    isActive: boolean;
}
export interface ITab {
    id: ETabStates;
    tab: JSX.Element;
}
export interface IStartMenuComponentProps {
    mode?: EStartMenuMode;
    open?: EStartMenuOpen;
    tabs?: ITab[];
}
export declare function StartMenuComponent({ mode, open, tabs }: IStartMenuComponentProps): JSX.Element;
