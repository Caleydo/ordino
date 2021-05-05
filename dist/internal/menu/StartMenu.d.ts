import { AppHeader } from 'phovea_ui';
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
export declare function StartMenuComponent({ header, mode, open }: {
    header: AppHeader;
    mode: EStartMenuMode;
    open: EStartMenuOpen;
}): JSX.Element;
