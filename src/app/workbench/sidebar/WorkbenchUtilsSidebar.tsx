import React, { useMemo, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { DetailsSidebar } from './DetailsSidebar';
import { IWorkbench } from '../../../store';

export function WorkbenchUtilsSidebar({ workbench }: { workbench: IWorkbench }) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  const [openedTab, setOpenedTab] = useState<string>(workbench.index > 0 && ordino.midTransition ? 'mapping' : null);

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
        return <div style={{ width: '250px' }}>Thats weird</div>;
      }
    }
  }, [openedTab, workbench]);

  return (
    <div className="d-flex p-1" style={{ borderRight: '1px solid lightgray' }}>
      <div className="d-flex flex-column">
        <button
          className={`btn shadow-none ${openedTab === 'add' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`}
          type="button"
          onClick={() => (openedTab === 'add' ? setOpenedTab(null) : setOpenedTab('add'))}
        >
          <i className="fas fa-plus-circle" />
        </button>
        {workbench.index > 0 ? (
          <button
            className={`btn shadow-none ${openedTab === 'mapping' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`}
            type="button"
            onClick={() => (openedTab === 'mapping' ? setOpenedTab(null) : setOpenedTab('mapping'))}
          >
            <i className="fas fa-database" />
          </button>
        ) : null}

        <button
          className={`btn shadow-none ${openedTab === 'filter' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`}
          type="button"
          onClick={() => (openedTab === 'filter' ? setOpenedTab(null) : setOpenedTab('filter'))}
        >
          <i className="fas fa-filter" />
        </button>
        <button
          className={`btn shadow-none ${openedTab === 'comment' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`}
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
