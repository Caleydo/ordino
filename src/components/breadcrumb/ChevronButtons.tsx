import React from 'react';
import { IChevronBreadcrumbProps } from './ChevronBreadcrumb';
import { getAllFilters } from '../../store/storeUtils';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addView } from '../../store/ordinoSlice';

export interface IChevronButtonsProps {
  color?: string;
}

export function ChevronButtons({ color = 'cornflowerblue' }: IChevronBreadcrumbProps) {
  const dispatch = useAppDispatch();
  const ordino = useAppSelector((state) => state.ordino);

  return (
    <>
      <div>
        <button
          onClick={() => {
            dispatch(
              addView({
                workbenchIndex: ordino.focusViewIndex,
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
          className="chevronButton btn btn-light btn-sm align-middle m-1"
          style={{ color }}
        >
          {' '}
          <i className="flex-grow-1 fas fa-chart-bar" /> Add View
        </button>
      </div>

      {/* <div>
                <button type="button" className="chevronButton btn btn-light btn-sm align-middle m-1" style={{color}}> <i className="flex-grow-1 fas fa-plus"/> Add Column</button>
            </div>

            <div>
                <button onClick={() => {
                    dispatch(setWorkbenchDirection({workbenchIndex: ordino.focusViewIndex, direction: ordino.workbenches[ordino.focusViewIndex].viewDirection === EWorkbenchDirection.HORIZONTAL ? EWorkbenchDirection.VERTICAL : EWorkbenchDirection.HORIZONTAL}));
                }}type="button" className="chevronButton btn btn-light btn-sm align-middle m-1" style={{color}}> <i className="flex-grow-1 fas fa-compass"/> Direction</button>
            </div> */}

      <div className="align-middle m-1 d-flex align-items-center">
        <i className="flex-grow-1 fas fa-filter" />
        <span className="m-1">{getAllFilters(ordino.workbenches[ordino.focusViewIndex]).length} items filtered out</span>
      </div>
    </>
  );
}
