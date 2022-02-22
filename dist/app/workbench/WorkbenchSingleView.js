import * as React from 'react';
import { useMemo } from 'react';
import { FindViewUtils, IDType, useAsync } from 'tdp_core';
import { useAppDispatch, useAppSelector } from '../..';
import { WorkbenchRankingView } from './WorkbenchRankingView';
import { WorkbenchGenericView } from './WorkbenchGenericView';
import { WorkbenchEmptyView } from './WorkbenchEmptyView';
export function getVisynView(entityId) {
    return FindViewUtils.findVisynViews(new IDType(entityId, '.*', '', true));
}
export function WorkbenchSingleView({ workbenchIndex, view }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const { value, status, error } = useAsync(getVisynView, [ordino.workbenches[workbenchIndex].entityId]);
    const chooserOptions = useMemo(() => {
        return value ? value.map((v) => v.v) : [];
    }, [value]);
    return (React.createElement(React.Fragment, null, view.id === '' ? (React.createElement(WorkbenchEmptyView, { chooserOptions: chooserOptions, workbenchIndex: workbenchIndex, view: view })) : view.id.startsWith('reprovisyn_ranking') ? (React.createElement(WorkbenchRankingView, { chooserOptions: chooserOptions, workbenchIndex: workbenchIndex, view: view })) : (React.createElement(WorkbenchGenericView, { chooserOptions: chooserOptions, workbenchIndex: workbenchIndex, view: view }))));
}
//# sourceMappingURL=WorkbenchSingleView.js.map