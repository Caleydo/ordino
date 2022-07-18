import React, { useMemo } from 'react';
import { IViewPluginDesc, useAsync } from 'tdp_core';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addView, EWorkbenchDirection, addWorkbench, IWorkbench } from '../../store';
import { isFirstWorkbench, isFocusWorkbench } from '../../store/storeUtils';
import { isVisynRankingViewDesc } from '../../views';
import { EViewChooserMode, ViewChooser } from '../viewChooser/ViewChooser';
import { WorkbenchUtilsSidebar } from './sidebar/WorkbenchUtilsSidebar';
import { getVisynView } from './WorkbenchView';
import { EWorkbenchType, WorkbenchViews } from './WorkbenchViews';

interface IWorkbenchProps {
  workbench: IWorkbench;
  type?: EWorkbenchType;
}

export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }: IWorkbenchProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  const { value: availableViews } = useAsync(getVisynView, [workbench.entityId]);

  // need to add the color to the views for the viewChooser.
  const editedViews = useMemo(() => {
    return availableViews?.map((view) => {
      if (isVisynRankingViewDesc(view)) {
        return { ...view, color: ordino.colorMap[view.itemIDType] };
      }

      return { ...view, color: ordino.colorMap[workbench.itemIDType] };
    });
  }, [availableViews, ordino.colorMap, workbench.itemIDType]);

  return (
    <div
      className={`d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${ordino.midTransition ? 'transition' : ''} ${type} ${
        ordino.focusWorkbenchIndex === 0 ? 'start' : ''
      }`}
      style={{ borderTopColor: ordino.colorMap[workbench.entityId] }}
    >
      {isFocusWorkbench(workbench) || ordino.midTransition ? (
        <WorkbenchUtilsSidebar workbench={workbench} openTab={!isFirstWorkbench(workbench) && ordino.midTransition ? 'mapping' : null} />
      ) : null}

      <WorkbenchViews index={workbench.index} type={type} />
      {isFocusWorkbench(workbench) ? (
        <div className="d-flex" style={{ borderLeft: '1px solid lightgray' }}>
          <ViewChooser
            views={editedViews || []}
            selectedView={null}
            showBurgerMenu={false}
            mode={EViewChooserMode.EMBEDDED}
            onSelectedView={(newView: IViewPluginDesc) => {
              if (isVisynRankingViewDesc(newView)) {
                const defaultMapping = {
                  entityId: newView.relation.mapping[0].entity,
                  columnSelection: newView.relation.mapping[0].sourceToTargetColumns[0].columnName,
                };

                dispatch(
                  addWorkbench({
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
                    name: newView.itemName,
                    index: workbench.index + 1,
                    selection: [],
                  }),
                );
              } else {
                dispatch(
                  addView({
                    workbenchIndex: ordino.focusWorkbenchIndex,
                    view: {
                      name: newView.name,
                      id: newView.id,
                      uniqueId: (Math.random() + 1).toString(36).substring(7),
                      filters: [],
                    },
                  }),
                );
              }
            }}
            isEmbedded={false}
          />
        </div>
      ) : null}
    </div>
  );
}
