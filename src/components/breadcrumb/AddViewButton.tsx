import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addView } from '../../store';

export interface IAddViewButton {
  color?: string;
}

export function AddViewButton({ color = 'cornflowerblue' }: IAddViewButton) {
  const dispatch = useAppDispatch();
  const ordino = useAppSelector((state) => state.ordino);

  return (
    <div>
      <button
        onClick={() => {
          dispatch(
            addView({
              workbenchIndex: ordino.focusWorkbenchIndex,
              view: {
                name: '',
                id: '',
                uniqueId: (Math.random() + 1).toString(36).substring(7),
                filters: [],
              },
            }),
          );
        }}
        type="button"
        className="chevronButton btn btn-text btn-sm align-middle m-1"
        style={{ color }}
      >
        {' '}
        <i className="flex-grow-1 fas fa-chart-bar" /> Add View
      </button>
    </div>
  );
}
