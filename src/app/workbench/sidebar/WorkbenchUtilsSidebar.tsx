import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { DetailsSidebar } from './DetailsSidebar';
import { IWorkbench } from '../../../store';

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
        <button
          className={`btn borderRadiusNone shadow-none ${openedTab === 'add' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`}
          type="button"
          onClick={() => (openedTab === 'add' ? setOpenedTab(null) : setOpenedTab('add'))}
        >
          <i className="fas fa-plus-circle" />
        </button>
        {workbench.index > 0 ? (
          <button
            className={`btn borderRadiusNone shadow-none ${openedTab === 'mapping' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`}
            type="button"
            onClick={() => (openedTab === 'mapping' ? setOpenedTab(null) : setOpenedTab('mapping'))}
          >
            <i className="fas fa-database" />
          </button>
        ) : null}

        <button
          className={`btn borderRadiusNone shadow-none ${openedTab === 'filter' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`}
          type="button"
          onClick={() => (openedTab === 'filter' ? setOpenedTab(null) : setOpenedTab('filter'))}
        >
          <i className="fas fa-filter" />
        </button>
        <button
          className={`btn borderRadiusNone shadow-none ${openedTab === 'comment' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`}
          type="button"
          onClick={() => (openedTab === 'comment' ? setOpenedTab(null) : setOpenedTab('comment'))}
        >
          <i className="fas fa-comment" />
        </button>
      </div>
      {openedTab !== null ? <div>{openedTabComponent}</div> : null}
    </div>
  );
}
