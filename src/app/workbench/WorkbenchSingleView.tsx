import * as React from 'react';
import {useEffect, useMemo} from 'react';
import {ViewChooser} from '..';
import {useAppDispatch, useAppSelector} from '../..';
import {FindViewUtils, IDType, IViewPluginDesc, useAsync} from 'tdp_core';
import {IWorkbenchView, setView} from '../../store';
import {findViewIndex} from '../../store/storeUtils';
import {WorkbenchRankingView} from './WorkbenchRankingView';
import {WorkbenchGenericView} from './WorkbenchGenericView';
import {EViewChooserMode} from '../ViewChooser';
import {WorkbenchEmptyView} from './WorkbenchEmptyView';

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

    const chooserOptions = useMemo(() => {
        return value ? value.map((v) => v.v) : [];
    }, [value]);

    return (
        <>
            {view.id === '' ?
            <WorkbenchEmptyView chooserOptions={chooserOptions} workbenchIndex={workbenchIndex} view={view}/>
             : view.id.startsWith('reprovisyn_ranking') ?
            <WorkbenchRankingView chooserOptions={chooserOptions} workbenchIndex={workbenchIndex} view={view}/>
            :
            <WorkbenchGenericView chooserOptions={chooserOptions} workbenchIndex={workbenchIndex} view={view}/> }
        </>
    );
}
