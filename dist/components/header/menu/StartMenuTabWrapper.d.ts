import { ETabStates } from '../../../../dist';
export interface ITab {
    id: ETabStates;
    tab: JSX.Element;
}
export interface IStartMenuTabWrapperProps {
    /**
     * List of tabs
     */
    tabs?: ITab[];
    /**
     * Define the mode of the start menu
     */
    mode?: 'overlay' | 'start';
}
export declare function StartMenuTabWrapper({ tabs, mode }: IStartMenuTabWrapperProps): JSX.Element;
