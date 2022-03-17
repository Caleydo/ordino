import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { AddViewButton } from './AddViewButton';
import { IWorkbench } from '../../store';
import { ChevronBreadcrumb } from './ChevronBreadcrumb';
import { ShowDetailsSwitch } from './ShowDetailsSwitch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FilterAndSelected } from './FilterAndSelected';

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
    const ro = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      entries.forEach((e) => {
        setWidth(e.contentRect.width);
      });
    });

    ro.observe(ref.current);
  }, []);

  return (
    <div className={`position-relative ${onClick ? 'cursor-pointer' : ''}`} ref={ref} style={{ flexGrow: flexWidth }} onClick={onClick}>
      <div className="position-absolute chevronDiv top-50 start-50 translate-middle d-flex">
        {workbench ? (
          workbench.index === ordino.focusViewIndex ? (
            <FilterAndSelected />
          ) : (
            <p className="chevronText flex-grow-1">{workbench.index === ordino.focusViewIndex ? workbench.name : `${workbench.name.slice(0, 5)}..`}</p>
          )
        ) : (
          <i className="flex-grow-1 fas fa-plus" />
        )}
      </div>

      <div className="position-absolute chevronDiv top-50 translate-middle-y d-flex" style={{ left: first ? (workbench.index > 0 ? '0px' : '20px') : '4px' }}>
        {workbench && workbench.index === ordino.focusViewIndex ? (
          <>
            {workbench.index > 0 ? <ShowDetailsSwitch /> : null}
            <p className="chevronText flex-grow-1">{workbench.index === ordino.focusViewIndex ? workbench.name : `${workbench.name.slice(0, 5)}..`}</p>
          </>
        ) : null}
      </div>
      <div className="position-absolute chevronDiv top-50 translate-middle-y d-flex" style={{ right: '8px' }}>
        {workbench && workbench.index === ordino.focusViewIndex ? (
          <>
            <AddViewButton color="white" />
            {/* <button type="button" className="btn btn-icon-light btn-sm align-middle m-1">
              <i className="flex-grow-1 fas fa-close" />
            </button> */}
          </>
        ) : null}
      </div>
      <ChevronBreadcrumb color={color} width={width} first={first} />
    </div>
  );
}
