import React, { useEffect, useMemo, useState } from 'react';
import { NodeId } from '@trrack/core';
import { TrrackStoreType } from '@trrack/redux';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { DetailsSidebar } from './DetailsSidebar';
import { IWorkbench, trrack, useTrrackSelector } from '../../../store';
import { SidebarButton } from './SidebarButton';
import { isFirstWorkbench, isFocusWorkbench } from '../../../store/storeUtils';
import { CommentSidebarButton } from './CommentSidebarButton';
import { CommentPanelTabPane } from './CommentPanelTabPane';
import { ProvVis } from './trrackVis/src/components/ProvVis';

export function WorkbenchUtilsSidebar({ workbench, openTab = '' }: { workbench: IWorkbench; openTab?: string }) {
  const { midTransition, colorMap } = useAppSelector((state) => state.ordinoTracked);
  const focusIndex = useAppSelector((state) => state.ordinoTracked.focusWorkbenchIndex);

  const [openedTab, setOpenedTab] = useState<string>(openTab);

  const currentTrrackNode: NodeId = useTrrackSelector((s: TrrackStoreType) => s.current);

  const openedTabComponent: React.ReactElement = useMemo(() => {
    switch (openedTab) {
      case 'add': {
        return <div style={{ width: '250px' }}>Adding something</div>;
      }
      case 'mapping': {
        return <DetailsSidebar workbench={workbench} />;
      }
      case 'filter': {
        return (
          <div className="ps-2" style={{ width: '250px' }}>
            <ProvVis
              root={trrack.root.id}
              config={{ changeCurrent: (node: NodeId) => trrack.to(node), verticalSpace: 25, marginTop: 25, gutter: 25 }}
              nodeMap={trrack.graph.backend.nodes}
              currentNode={currentTrrackNode}
            />
          </div>
        );
      }
      case 'comment': {
        return <CommentPanelTabPane itemIDType={workbench.itemIDType} selection={workbench.selection} />;
      }
      default: {
        return <div style={{ width: '250px' }}>There was an error finding the correct tab</div>;
      }
    }
  }, [openedTab, workbench, currentTrrackNode]);

  useEffect(() => {
    if (midTransition === true && isFocusWorkbench(workbench)) {
      setOpenedTab(null);
    }
  }, [midTransition, workbench, focusIndex]);

  return (
    <div className="d-flex h-100" style={{ borderRight: !openedTab ? '' : '1px solid lightgray' }}>
      <div className="d-flex flex-column me-1" style={{ borderRight: '1px solid lightgray' }}>
        <SidebarButton
          isSelected={openedTab === 'add'}
          color={colorMap[workbench.entityId]}
          icon="fas fa-plus-circle"
          onClick={() => (openedTab === 'add' ? setOpenedTab(null) : setOpenedTab('add'))}
        />
        {!isFirstWorkbench(workbench) ? (
          <SidebarButton
            isSelected={openedTab === 'mapping'}
            color={colorMap[workbench.entityId]}
            icon="fas fa-database"
            onClick={() => (openedTab === 'mapping' ? setOpenedTab(null) : setOpenedTab('mapping'))}
          />
        ) : null}

        <SidebarButton
          isSelected={openedTab === 'filter'}
          color={colorMap[workbench.entityId]}
          icon="fas fa-filter"
          onClick={() => (openedTab === 'filter' ? setOpenedTab(null) : setOpenedTab('filter'))}
        />
        <CommentSidebarButton
          isSelected={openedTab === 'comment'}
          color={colorMap[workbench.entityId]}
          idType={workbench.itemIDType}
          selection={workbench.selection}
          icon="fas fa-comment"
          onClick={() => (openedTab === 'comment' ? setOpenedTab(null) : setOpenedTab('comment'))}
        />
      </div>
      {openedTab !== null ? openedTabComponent : null}
    </div>
  );
}
