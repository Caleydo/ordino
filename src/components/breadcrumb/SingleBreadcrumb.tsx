import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { ChevronButtons } from './ChevronButtons';
import { IWorkbench } from '../../store';
import { ChevronBreadcrumb } from './ChevronBreadcrumb';
import { ShowDetailsSwitch } from './ShowDetailsSwitch';
import { useAppSelector } from '../../hooks/useAppSelector';

export interface ISingleBreadcrumbProps {
  first?: boolean;
  flexWidth?: number;
  onClick?: () => void;
  color?: string;
  workbench?: IWorkbench;
}

export function SingleBreadcrumb({ first = false, flexWidth = 1, onClick = null, color = 'cornflowerblue', workbench = null }: ISingleBreadcrumbProps) {
  const ordino = useAppSelector((state) => state.ordino);

  const [width, setWidth] = useState<number>();

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);

  return (
    <div className="position-relative" ref={ref} style={{ flexGrow: flexWidth }} onClick={onClick}>
      <div className="position-absolute chevronDiv top-50 start-50 translate-middle d-flex">
        {workbench ? (
          <p className="chevronText flex-grow-1">{workbench.index === ordino.focusViewIndex ? workbench.name : `${workbench.name.slice(0, 5)}..`}</p>
        ) : (
          <i className="flex-grow-1 fas fa-plus" />
        )}
      </div>

      <div className="position-absolute chevronDiv top-50 translate-middle-y d-flex" style={{ left: first ? '8px' : '16px' }}>
        {workbench && workbench.index === ordino.focusViewIndex ? (
          <>
            <ShowDetailsSwitch />
            <ChevronButtons color={color} />
          </>
        ) : null}
      </div>
      <div className="position-absolute chevronDiv top-50 end-0 translate-middle d-flex" style={{ right: first ? '8px' : '16px' }}>
        {workbench && workbench.index === ordino.focusViewIndex ? (
          <button type="button" className="btn btn-icon-light btn-sm align-middle m-1">
            <i className="flex-grow-1 fas fa-close" />
          </button>
        ) : null}
      </div>
      <ChevronBreadcrumb color={color} width={width} first={first} />
    </div>
  );
}
