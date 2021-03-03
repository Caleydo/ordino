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
export declare function StartMenuComponent({ header, mode }: {
    header: AppHeader;
    mode: EStartMenuMode;
}): JSX.Element;
