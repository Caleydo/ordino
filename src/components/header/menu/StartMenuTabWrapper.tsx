import React, {ComponentType} from 'react';
import {useAppDispatch, useAppSelector} from '../../..';
import {setActiveTab} from '../../../store';


export interface ITab {
    id: string;
    Tab: ComponentType;
    name: string;
}


export enum EStartMenuMode {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    START = 'start',

    /**
     * an analysis in the background, the start menu can be closed
     */
    OVERLAY = 'overlay'
}

export enum EStartMenuOpen {
    /**
     * no analysis in the background, the start menu cannot be closed
     */
    OPEN = 'open',

    /**
     * an analysis in the background, the start menu can be closed
     */
    CLOSED = 'closed'
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

export function StartMenuTabWrapper(props: IStartMenuTabWrapperProps) {
    const ordinoState = useAppSelector((state) => state.ordino);
    const menu: any = useAppSelector<any>((state) => state.menu) as any;
    const dispatch = useAppDispatch();

    return (
        <>
            <div id="ordino-start-menu" className={`ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : 'd-none'} ${props.mode === EStartMenuMode.OVERLAY ? 'ordino-start-menu-overlay' : ''}`}>
                {props.tabs.map(({id, Tab}) => (
                    <div className={`tab-pane fade ${props.activeTab === id ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`}
                        key={id}
                        id={id}
                        role="tabpanel"
                        aria-labelledby={`${id}-tab`}
                    >
                        {props.mode === EStartMenuMode.OVERLAY &&
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col position-relative d-flex justify-content-end">
                                        <button className="btn-close" onClick={() => {dispatch(setActiveTab(null));}}>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                        <Tab />
                    </div>
                ))}
            </div></>
    );
}
