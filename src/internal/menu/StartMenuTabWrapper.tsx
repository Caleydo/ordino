import React from 'react';
import {EStartMenuMode} from '.';
import {IStartMenuTabPlugin} from '../..';

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


export function StartMenuTabWrapper(props: IStartMenuTabWrapperProps) {
    return (
        <>
            {props.status === 'success' &&
                <div id="ordino-start-menu" className={`ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : 'd-none'} ${props.mode === EStartMenuMode.OVERLAY ? 'ordino-start-menu-overlay' : ''}`}>
                    {props.tabs.map((tab) => (
                        <div className={`tab-pane fade ${props.activeTab === tab ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`}
                            key={tab.desc.id}
                            id={tab.desc.id}
                            role="tabpanel"
                            aria-labelledby={`${tab.desc.id}-tab`}
                        >
                            {props.mode === EStartMenuMode.OVERLAY &&
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col position-relative d-flex justify-content-end">
                                            <button className="btn-close" onClick={() => {props.setActiveTab(null);}}>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                            <tab.factory isActive={props.activeTab === tab} />
                        </div>
                    ))}
                </div>
            }</>
    );
}
