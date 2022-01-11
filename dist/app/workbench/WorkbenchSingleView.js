import * as React from 'react';
import { useEffect } from 'react';
import { ViewChooser } from '..';
import { useAppDispatch, useAppSelector } from '../..';
import { useAsync } from '../../../../tdp_core/dist';
import { setView } from '../../store';
import { findViewIndex } from '../../store/storeUtils';
import { useLoadAvailableViews } from './useLoadAvailableViews';
import { WorkbenchRankingView } from './WorkbenchRankingView';
import { WorkbenchGenericView } from './WorkbenchGenericView';
export function WorkbenchSingleView({ workbenchIndex, view }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const { value, status, error } = useAsync(useLoadAvailableViews, [ordino.workbenches[workbenchIndex].entityId]);
    console.log(ordino);
    useEffect(() => {
        console.log(value, status);
    }, [status]);
    return (React.createElement(React.Fragment, null, view.id === '' ?
        React.createElement("div", null,
            React.createElement(ViewChooser, { views: value ? value : [], onSelectedView: (newView) => {
                    dispatch(setView({
                        workbenchIndex,
                        viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                        viewId: newView.id
                    }));
                }, isEmbedded: false })) : view.id.startsWith('reprovisyn_ranking') ?
        React.createElement(WorkbenchRankingView, { workbenchIndex: workbenchIndex, view: view }) : React.createElement(WorkbenchGenericView, { workbenchIndex: workbenchIndex, view: view })));
}
//# sourceMappingURL=WorkbenchSingleView.js.map