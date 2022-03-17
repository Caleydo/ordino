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
    <div className="form-check form-switch align-middle m-1">
      <input
        checked={ordino.workbenches[ordino.focusViewIndex].detailsOpen}
        onChange={() => dispatch(setDetailsOpen({ workbenchIndex: ordino.focusViewIndex, open: !ordino.workbenches[ordino.focusViewIndex].detailsOpen }))}
        className="form-check-input checked"
        type="checkbox"
        id="flexSwitchCheckChecked"
      />
      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
        Show Details
      </label>
    </div>
  );
}
