import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { DetailsSidebar } from './DetailsSidebar';
import { IWorkbench } from '../../../store';
import { SidebarButton } from './SidebarButton';

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
        return <div style={{ width: '250px' }}>Filter something</div>;
      }
      case 'comment': {
        return <div style={{ width: '250px' }}>Comment something</div>;
      }
      default: {
        return <div style={{ width: '250px' }}>There was an error finding the correct tab</div>;
      }
    }
  }, [openedTab, workbench]);

  useEffect(() => {
    if (ordino.midTransition === true && workbench.index === ordino.focusWorkbenchIndex) {
      setOpenedTab(null);
    }
  }, [ordino.midTransition, workbench.index, ordino.focusWorkbenchIndex]);

  return (
    <div className="d-flex h-100" style={{ borderRight: !openedTab ? '' : '1px solid lightgray' }}>
      <div className="d-flex flex-column me-1" style={{ borderRight: '1px solid lightgray' }}>
        <SidebarButton
          isSelected={openedTab === 'add'}
          color={ordino.colorMap[workbench.entityId]}
          icon="fas fa-plus-circle"
          onClick={() => (openedTab === 'add' ? setOpenedTab(null) : setOpenedTab('add'))}
        />
        {workbench.index > 0 ? (
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
        <SidebarButton
          isSelected={openedTab === 'comment'}
          color={ordino.colorMap[workbench.entityId]}
          icon="fas fa-comment"
          onClick={() => (openedTab === 'comment' ? setOpenedTab(null) : setOpenedTab('comment'))}
        />
      </div>
      {openedTab !== null ? <div>{openedTabComponent}</div> : null}
    </div>
  );
}
