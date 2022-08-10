import React, { useMemo } from 'react';
import { IPluginDesc, IViewPluginDesc, useAsync } from 'tdp_core';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { EWorkbenchDirection, IWorkbench } from '../../store';
import { addView, addWorkbench } from '../../store/ordinoTrrackedSlice';
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
  // const ordino = useAppSelector((state) => state.ordino);
  const { midTransition, colorMap } = useAppSelector((state) => state.ordinoTracked);
  const { focusWorkbenchIndex } = useAppSelector((state) => state.ordinoTracked);

  const dispatch = useAppDispatch();

  const { value: availableViews } = useAsync(getVisynView, [workbench.entityId]);

  // need to add the color to the views for the viewChooser.
  const editedViews = useMemo(() => {
    return availableViews?.map((view) => {
      if (isVisynRankingViewDesc(view)) {
        return { ...view, color: colorMap[view.itemIDType] };
      }

      return { ...view, color: colorMap[workbench.itemIDType] };
    });
  }, [availableViews, colorMap, workbench.itemIDType]);



  return (
    <div
      className={`d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${midTransition ? 'transition' : ''} ${type} ${focusWorkbenchIndex === 0 ? 'start' : ''}`}
      style={{ borderTopColor: colorMap[workbench.entityId] }}
    >
      {isFocusWorkbench(workbench) || midTransition ? (
        <WorkbenchUtilsSidebar workbench={workbench} openTab={!isFirstWorkbench(workbench) && midTransition ? 'mapping' : null} />
      ) : null}

      <WorkbenchViews index={workbench.index} type={type} />
      {isFocusWorkbench(workbench) ? (
        <div className="d-flex" style={{ borderLeft: '1px solid lightgray' }}>
          <ViewChooser
            views={editedViews || []}
            selectedView={null}
            showBurgerMenu={false}
            workbenchName={workbench.name}
            isWorkbenchTransitionDisabled={workbench.selection.length === 0}
            mode={EViewChooserMode.EMBEDDED}
            onSelectedView={(newView: IViewPluginDesc) => {
              if (isVisynRankingViewDesc(newView)) {
                const defaultMapping = {
                  entityId: newView.relation.mapping[0].entity,
                  columnSelection: newView.relation.mapping[0].columns[0].columnName,
                };

                dispatch(
                  addWorkbench({
                    itemIDType: newView.itemIDType,
                    detailsSidebarOpen: true,
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
                    viewDirection: EWorkbenchDirection.VERTICAL,
                    columnDescs: [],
                    data: {},
                    entityId: newView.itemIDType,
                    name: newView.name,
                    index: workbench.index + 1,
                    selection: [],
                  }),
                );
              } else {
                dispatch(
                  // Just set the config her
                  addView({
                    workbenchIndex: focusWorkbenchIndex,
                    view: {
                      name: newView.name,
                      id: newView.id,
                      uniqueId: (Math.random() + 1).toString(36).substring(7), // Why? Just use nanoid or something.
                      filters: [],
                      parameters: newView.defaultParameters,
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
