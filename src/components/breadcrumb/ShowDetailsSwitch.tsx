import * as React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setDetailsSidebarOpen } from '../../store';

export interface IShowDetailsSwitchProps {
  height?: number;
}

export function ShowDetailsSwitch({ height = 30 }: IShowDetailsSwitchProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          dispatch(
            setDetailsSidebarOpen({ workbenchIndex: ordino.focusWorkbenchIndex, open: !ordino.workbenches[ordino.focusWorkbenchIndex].detailsSidebarOpen }),
          )
        }
        className="btn btn-icon-light align-middle"
      >
        <i className="flex-grow-1 fas fa-bars m-1" />
      </button>
    </div>
  );
}
