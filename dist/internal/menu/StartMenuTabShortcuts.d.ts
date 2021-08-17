import React from 'react';
import { IStartMenuTabShortcutDesc } from '../..';
import { IStartMenuTabWrapperProps } from './StartMenuTabWrapper';
interface IStartMenuTabShortcutsProps extends Omit<IStartMenuTabWrapperProps, 'mode' | 'activeTab'> {
    /**
     * List of shortcut desc
     */
    shortcuts: IStartMenuTabShortcutDesc[];
    /**
     * Updates the highlight value in the `AppContext`
     */
    setHighlight: React.Dispatch<React.SetStateAction<boolean>>;
}
export declare function StartMenuTabShortcuts({ tabs, shortcuts, setActiveTab, setHighlight, status }: IStartMenuTabShortcutsProps): JSX.Element;
export {};
