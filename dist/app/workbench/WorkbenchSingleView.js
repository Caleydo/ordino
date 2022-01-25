import * as React from 'react';
import { useEffect } from 'react';
import { ViewChooser } from '..';
import { useAppDispatch, useAppSelector } from '../..';
import { FindViewUtils, IDType, useAsync } from 'tdp_core';
import { setView } from '../../store';
import { findViewIndex } from '../../store/storeUtils';
import { WorkbenchRankingView } from './WorkbenchRankingView';
import { WorkbenchGenericView } from './WorkbenchGenericView';
export function getVisynView(entityId) {
    return FindViewUtils.findVisynViews(new IDType(entityId, '.*', '', true));
}
export function WorkbenchSingleView({ workbenchIndex, view }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const { value, status, error } = useAsync(getVisynView, [ordino.workbenches[workbenchIndex].entityId]);
    console.log(ordino);
    useEffect(() => {
        console.log(value, status);
    }, [status]);
    return (React.createElement(React.Fragment, null, view.id === '' ?
        React.createElement("div", { id: view.id, className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" },
            React.createElement(ViewChooser, { views: value ? value.map((v) => v.v) : [], onSelectedView: (newView) => {
                    dispatch(setView({
                        workbenchIndex,
                        viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                        viewId: newView.id
                    }));
                }, isEmbedded: false })) : view.id.startsWith('reprovisyn_ranking') ?
        React.createElement(WorkbenchRankingView, { workbenchIndex: workbenchIndex, view: view }) : React.createElement(WorkbenchGenericView, { workbenchIndex: workbenchIndex, view: view })));
}
//# sourceMappingURL=WorkbenchSingleView.js.map