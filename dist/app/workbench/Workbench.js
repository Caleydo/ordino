import React, { useMemo } from 'react';
import { useAsync } from 'tdp_core';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addView, EWorkbenchDirection, addWorkbench } from '../../store';
import { isFirstWorkbench, isFocusWorkbench } from '../../store/storeUtils';
import { isVisynRankingViewDesc } from '../../views';
import { EViewChooserMode, ViewChooser } from '../viewChooser/ViewChooser';
import { WorkbenchUtilsSidebar } from './sidebar/WorkbenchUtilsSidebar';
import { getVisynView } from './WorkbenchView';
import { EWorkbenchType, WorkbenchViews } from './WorkbenchViews';
export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const { value: availableViews } = useAsync(getVisynView, [workbench.entityId]);
    // need to add the color to the views for the viewChooser.
    const editedViews = useMemo(() => {
        return availableViews === null || availableViews === void 0 ? void 0 : availableViews.map((view) => {
            if (isVisynRankingViewDesc(view)) {
                return { ...view, color: ordino.colorMap[view.itemIDType] };
            }
            return { ...view, color: ordino.colorMap[workbench.itemIDType] };
        });
    }, [availableViews, ordino.colorMap, workbench.itemIDType]);
    return (React.createElement("div", { className: `d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${ordino.midTransition ? 'transition' : ''} ${type} ${ordino.focusWorkbenchIndex === 0 ? 'start' : ''}`, style: { borderTopColor: ordino.colorMap[workbench.entityId] } },
        isFocusWorkbench(workbench) || ordino.midTransition ? (React.createElement(WorkbenchUtilsSidebar, { workbench: workbench, openTab: !isFirstWorkbench(workbench) && ordino.midTransition ? 'mapping' : null })) : null,
        React.createElement(WorkbenchViews, { index: workbench.index, type: type }),
        isFocusWorkbench(workbench) ? (React.createElement("div", { className: "d-flex", style: { borderLeft: '1px solid lightgray' } },
            React.createElement(ViewChooser, { views: editedViews || [], selectedView: null, showBurgerMenu: false, mode: EViewChooserMode.EMBEDDED, onSelectedView: (newView) => {
                    if (isVisynRankingViewDesc(newView)) {
                        const defaultMapping = {
                            entityId: newView.relation.mapping[0].entity,
                            columnSelection: newView.relation.mapping[0].columns[0].columnName,
                        };
                        dispatch(addWorkbench({
                            itemIDType: newView.itemIDType,
                            detailsSidebarOpen: true,
                            createNextWorkbenchSidebarOpen: false,
                            selectedMappings: [defaultMapping],
                            views: [
                                {
                                    name: newView.name,
                                    id: newView.id,
                                    parameters: { prevSelection: workbench.selection, selectedMappings: [defaultMapping] },
                                    uniqueId: (Math.random() + 1).toString(36).substring(7),
                                    filters: [],
                                },
                            ],
                            commentsOpen: false,
                            viewDirection: EWorkbenchDirection.VERTICAL,
                            columnDescs: [],
                            data: {},
                            entityId: newView.itemIDType,
                            name: newView.name,
                            index: workbench.index + 1,
                            selection: [],
                            commentsOpen: false,
                        }));
                    }
                    else {
                        dispatch(addView({
                            workbenchIndex: ordino.focusWorkbenchIndex,
                            view: {
                                name: newView.name,
                                id: newView.id,
                                uniqueId: (Math.random() + 1).toString(36).substring(7),
                                filters: [],
                            },
                        }));
                    }
                }, isEmbedded: false }))) : null));
}
//# sourceMappingURL=Workbench.js.map