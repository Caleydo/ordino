import React, { useMemo, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { DetailsSidebar } from './DetailsSidebar';
import { IWorkbench } from '../../../store';

export function WorkbenchUtilsSidebar({ workbench }: { workbench: IWorkbench }) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  const [openedTab, setOpenedTab] = useState<string>(null);

  const openedTabComponent: React.ReactElement = useMemo(() => {
    switch (openedTab) {
      case 'add': {
        return <div>Adding something</div>;
      }
      case 'mapping': {
        return <DetailsSidebar workbench={workbench} />;
      }
      case 'filter': {
        return <div>Filter something</div>;
      }
      case 'comment': {
        return <div>Comment something</div>;
      }
      default: {
        return <div>Thats weird</div>;
      }
    }
  }, [openedTab, workbench]);

  return (
    <div className="d-flex">
      <div className="d-flex flex-column">
        <button className="btn btn-icon-dark shadow-none" type="button" onClick={() => setOpenedTab('add')}>
          <i className="fas fa-plus-circle" />
        </button>
        <button className="btn btn-icon-dark shadow-none" type="button" onClick={() => setOpenedTab('mapping')}>
          <i className="fas fa-database" />
        </button>
        <button className="btn btn-icon-dark shadow-none" type="button" onClick={() => setOpenedTab('filter')}>
          <i className="fas fa-filter" />
        </button>
        <button className="btn btn-icon-dark shadow-none" type="button" onClick={() => setOpenedTab('comment')}>
          <i className="fas fa-comment" />
        </button>
      </div>
      {openedTab !== null ? <div>{openedTabComponent}</div> : null}
    </div>
  );
}
