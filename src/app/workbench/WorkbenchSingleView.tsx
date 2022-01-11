import * as React from 'react';
import {useEffect} from 'react';
import {ViewChooser} from '..';
import {useAppDispatch, useAppSelector} from '../..';
import {IViewPluginDesc, useAsync} from '../../../../tdp_core/dist';
import {IWorkbenchView, setView} from '../../store';
import {findViewIndex} from '../../store/storeUtils';
import {useLoadAvailableViews} from './useLoadAvailableViews';
import {WorkbenchRankingView} from './WorkbenchRankingView';
import {WorkbenchGenericView} from './WorkbenchGenericView';

export interface IWorkbenchSingleViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}

export function WorkbenchSingleView({
    workbenchIndex,
    view
}: IWorkbenchSingleViewProps) {
    const dispatch = useAppDispatch();

    const ordino = useAppSelector((state) => state.ordino);
    const {value, status, error} = useAsync(useLoadAvailableViews, [ordino.workbenches[workbenchIndex].entityId]);

    console.log(ordino);

    useEffect(() => {
        console.log(value, status);
    }, [status]);

    return (
        <>
            {view.id === '' ?
            <div>
                <ViewChooser views={value ? value : []} onSelectedView={(newView:IViewPluginDesc) => {
                    dispatch(setView({
                        workbenchIndex,
                        viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                        viewId: newView.id
                    }));
                }} isEmbedded={false}/>
            </div> : view.id.startsWith('reprovisyn_ranking') ?
            <WorkbenchRankingView workbenchIndex={workbenchIndex} view={view}/> : <WorkbenchGenericView workbenchIndex={workbenchIndex} view={view}/> }
        </>
    );
}
