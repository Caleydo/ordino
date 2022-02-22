import { ComponentType } from 'react';
import { EStartMenuMode } from '../../store/menuSlice';
export interface ITab {
    id: string;
    Tab: ComponentType;
    name: string;
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
//# sourceMappingURL=StartMenuTabWrapper.d.ts.map