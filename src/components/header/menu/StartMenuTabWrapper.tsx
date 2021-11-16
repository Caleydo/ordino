import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ETabStates, IOrdinoAppState, setActiveTab} from '../../../store';
import DatasetsTab from './tabs/DatasetsTab';

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

export function StartMenuTabWrapper({
    tabs = [{id: ETabStates.DATASETS, tab: <DatasetsTab/>}],
    mode = 'overlay'
}: IStartMenuTabWrapperProps) {
    const ordinoState: IOrdinoAppState = useSelector<any>((state) => state.ordino) as IOrdinoAppState;
    const dispatch = useDispatch();

    return (
        <>
            <div id="ordino-start-menu" className={`ordino-start-menu tab-content ${ordinoState.activeTab !== ETabStates.NONE ? 'ordino-start-menu-open' : 'd-none'} ${mode === 'overlay' ? 'ordino-start-menu-overlay' : ''}`}>
                {tabs.map((tab) => (
                    <div className={`tab-pane fade ${ordinoState.activeTab === tab.id ? `active show` : ''} ${mode === 'start' ? `pt-5` : ''}`}
                        key={tab.id}
                        id={tab.id}
                        role="tabpanel"
                        aria-labelledby={`${tab.id}-tab`}
                    >
                        {mode === 'overlay' &&
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col position-relative d-flex justify-content-end">
                                        <button
                                        className="btn-close"
                                        onClick={() =>
                                            dispatch(
                                                setActiveTab({
                                                    activeTab: ETabStates.NONE
                                            }))
                                        }>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                        {tab.tab}
                    </div>
                ))}
            </div>
        </>
    );
}
