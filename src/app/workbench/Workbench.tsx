import React from 'react';
import { IViewPluginDesc, useAsync } from 'tdp_core';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addView, EWorkbenchDirection, addWorkbench, IWorkbench, changeFocus, setCreateNextWorkbenchSidebarOpen } from '../../store';
import { isVisynRankingView, isVisynRankingViewDesc } from '../../views';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';
import { getVisynView } from './WorkbenchView';
import { EWorkbenchType, WorkbenchViews } from './WorkbenchViews';

interface IWorkbenchProps {
  workbench: IWorkbench;
  type?: EWorkbenchType;
}

export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }: IWorkbenchProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  const { status, value: availableViews } = useAsync(getVisynView, [workbench.entityId]);

  return (
    <div
      className={`d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusWorkbenchIndex === 0 ? 'start' : ''}`}
      style={{ borderTopColor: ordino.colorMap[workbench.entityId] }}
    >
      <WorkbenchViews index={workbench.index} type={type} />
      <div className="d-flex me-1">
        <ViewChooser
          views={availableViews || []}
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
                  viewDirection: EWorkbenchDirection.VERTICAL,
                  columnDescs: [],
                  data: {},
                  entityId: newView.itemIDType,
                  name: newView.itemName,
                  index: workbench.index + 1,
                  selection: [],
                }),
              );

              setTimeout(() => {
                dispatch(changeFocus({ index: ordino.focusWorkbenchIndex + 1 }));
                dispatch(setCreateNextWorkbenchSidebarOpen({ workbenchIndex: workbench.index, open: false }));
              }, 0);
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

            // dispatch(
            //   setView({
            //     workbenchIndex,
            //     viewIndex: findViewIndex(view.uniqueId, currentWorkbench),
            //     viewId: newView.id,
            //     viewName: newView.name,
            //   }),
            // );
          }}
          isEmbedded={false}
        />
      </div>
    </div>
  );
}
