import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { DetailsSidebar } from './DetailsSidebar';
import { IWorkbench } from '../../../store';
import { SidebarButton } from './SidebarButton';
import { isFirstWorkbench, isFocusWorkbench } from '../../../store/storeUtils';
import { CommentSidebarButton } from './CommentSidebarButton';
import { CommentPanelTabPane } from './CommentPanelTabPane';
import { FilterSidebar } from './FilterSidebar';

export function WorkbenchUtilsSidebar({ workbench, openTab = '' }: { workbench: IWorkbench; openTab?: string }) {
  const ordino = useAppSelector((state) => state.ordino);

  const [openedTab, setOpenedTab] = useState<string>(openTab);

  const openedTabComponent: React.ReactElement = useMemo(() => {
    switch (openedTab) {
      case 'add': {
        return <div style={{ width: '250px' }}>Adding something</div>;
      }
      case 'mapping': {
        return <DetailsSidebar workbench={workbench} />;
      }
      case 'filter': {
        return <FilterSidebar workbench={workbench} />;
      }
      case 'comment': {
        return <CommentPanelTabPane itemIDType={workbench.itemIDType} selection={workbench.selection} />;
      }
      default: {
        return <div style={{ width: '250px' }}>There was an error finding the correct tab</div>;
      }
    }
  }, [openedTab, workbench]);

  useEffect(() => {
    if (ordino.midTransition === true && isFocusWorkbench(workbench)) {
      setOpenedTab(null);
    }
  }, [ordino.midTransition, workbench, ordino.focusWorkbenchIndex]);

  return (
    <div className="d-flex h-100" style={{ borderRight: !openedTab ? '' : '1px solid lightgray' }}>
      <div className="d-flex flex-column me-1" style={{ borderRight: '1px solid lightgray' }}>
        <SidebarButton
          isSelected={openedTab === 'add'}
          color={ordino.colorMap[workbench.entityId]}
          icon="fas fa-plus-circle"
          onClick={() => (openedTab === 'add' ? setOpenedTab(null) : setOpenedTab('add'))}
        />
        {!isFirstWorkbench(workbench) ? (
          <SidebarButton
            isSelected={openedTab === 'mapping'}
            color={ordino.colorMap[workbench.entityId]}
            icon="fas fa-database"
            onClick={() => (openedTab === 'mapping' ? setOpenedTab(null) : setOpenedTab('mapping'))}
          />
        ) : null}

        <SidebarButton
          isSelected={openedTab === 'filter'}
          color={ordino.colorMap[workbench.entityId]}
          icon="fas fa-filter"
          onClick={() => (openedTab === 'filter' ? setOpenedTab(null) : setOpenedTab('filter'))}
        />
        <CommentSidebarButton
          isSelected={openedTab === 'comment'}
          color={ordino.colorMap[workbench.entityId]}
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
