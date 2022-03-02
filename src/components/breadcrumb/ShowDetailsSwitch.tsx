import * as React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setDetailsOpen } from '../../store/ordinoSlice';

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
        onClick={() => dispatch(setDetailsOpen({ workbenchIndex: ordino.focusViewIndex, open: !ordino.workbenches[ordino.focusViewIndex].detailsOpen }))}
        className="btn btn-icon-light align-middle"
      >
        <i className="flex-grow-1 fas fa-bars m-1" />
      </button>
    </div>
  );
}
