import * as React from 'react';
import {useEffect} from 'react';
import {ViewChooser} from '..';
import {useAppDispatch, useAppSelector} from '../..';
import {FindViewUtils, IDType, IViewPluginDesc, useAsync} from 'tdp_core';
import {IWorkbenchView, setView} from '../../store';
import {findViewIndex} from '../../store/storeUtils';
import {WorkbenchRankingView} from './WorkbenchRankingView';
import {WorkbenchGenericView} from './WorkbenchGenericView';

export interface IWorkbenchSingleViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}

export function getVisynView(entityId: string) {
    return FindViewUtils.findVisynViews(new IDType(entityId, '.*', '', true));
}

export function WorkbenchSingleView({
    workbenchIndex,
    view
}: IWorkbenchSingleViewProps) {
    const dispatch = useAppDispatch();

    const ordino = useAppSelector((state) => state.ordino);

    const {value, status, error} = useAsync(getVisynView, [ordino.workbenches[workbenchIndex].entityId]);

    useEffect(() => {
        console.log(value, status);
    }, [status]);

    return (
        <>
            {view.id === '' ?
            <div className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
                <div className="w-100 h-100">
                    <ViewChooser views={value ? value.map((v) => v.v) : []} onSelectedView={(newView:IViewPluginDesc) => {
                        dispatch(setView({
                            workbenchIndex,
                            viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                            viewId: newView.id
                        }));
                    }} isEmbedded={false}/>
                </div>
            </div> : view.id.startsWith('reprovisyn_ranking') ?
            <WorkbenchRankingView workbenchIndex={workbenchIndex} view={view}/> : <WorkbenchGenericView workbenchIndex={workbenchIndex} view={view}/> }
        </>
    );
}
