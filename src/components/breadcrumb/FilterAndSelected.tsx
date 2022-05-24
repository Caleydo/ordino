import React, { useMemo } from 'react';
import { I18nextManager } from 'tdp_core';
import { getAllFilters } from '../../store/storeUtils';
import { useAppSelector } from '../../hooks/useAppSelector';

function equalArrays<T>(a: T[], b: T[]) {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((ai, i) => ai === b[i]);
}

export function FilterAndSelected() {
  const ordino = useAppSelector((state) => state.ordino);

  const dataLength = useMemo(() => {
    return Object.keys(ordino.workbenches[ordino.focusWorkbenchIndex].data).length;
  }, [ordino.focusWorkbenchIndex, ordino.workbenches]);

  const filterLength = useMemo(() => {
    return getAllFilters(ordino.workbenches[ordino.focusWorkbenchIndex]).length;
  }, [ordino.focusWorkbenchIndex, ordino.workbenches]);

  const selectedLength = useMemo(() => {
    return ordino.workbenches[ordino.focusWorkbenchIndex].selection.length;
  }, [ordino.focusWorkbenchIndex, ordino.workbenches]);

  return (
    <div className="align-middle m-1 d-flex align-items-center">
      {!equalArrays(ordino.globalQuery.filter.val, ordino.appliedQueryFilter.val) ? (
        <i
          className="fa fa-filter"
          aria-hidden="true"
          title={I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.appliedQueryFilterTitle', {
            entityName: ordino.workbenches[ordino.focusWorkbenchIndex].name,
            globalQueryName: ordino.globalQuery.name,
            selectedValues: ordino.appliedQueryFilter.val.join(','),
          })}
        />
      ) : null}
      <span className="m-1">
        {dataLength - filterLength} of {dataLength} {ordino.workbenches[ordino.focusWorkbenchIndex].name}s / {selectedLength}{' '}
        {ordino.workbenches[ordino.focusWorkbenchIndex].name}s selected
      </span>
    </div>
  );
}
