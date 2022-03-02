import React, { useMemo } from 'react';
import { getAllFilters } from '../../store/storeUtils';
import { useAppSelector } from '../../hooks/useAppSelector';

export function FilterAndSelected() {
  const ordino = useAppSelector((state) => state.ordino);

  const dataLength = useMemo(() => {
    return Object.keys(ordino.workbenches[ordino.focusViewIndex].data).length;
  }, [ordino.focusViewIndex, ordino.workbenches]);

  const filterLength = useMemo(() => {
    return getAllFilters(ordino.workbenches[ordino.focusViewIndex]).length;
  }, [ordino.focusViewIndex, ordino.workbenches]);

  return (
    <div className="align-middle m-1 d-flex align-items-center">
      <span className="m-1">
        {dataLength - filterLength} of {dataLength} {ordino.workbenches[ordino.focusViewIndex].name}s /{' '}
        {ordino.workbenches[ordino.focusViewIndex].selection.length} {ordino.workbenches[ordino.focusViewIndex].name}s selected
      </span>
    </div>
  );
}
