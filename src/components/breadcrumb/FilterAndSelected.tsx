import React, { useMemo } from 'react';
import { I18nextManager } from 'tdp_core';
import _ from 'lodash';
import { getAllFilters } from '../../store/storeUtils';
import { useAppSelector } from '../../hooks/useAppSelector';

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

  const isQueryFilterEqual = useMemo(() => {
    return _.isEqual(ordino.globalQueryCategories, ordino.appliedQueryCategories);
  }, [ordino.globalQueryCategories, ordino.appliedQueryCategories]);

  return (
    <div className="text-truncate align-middle m-1 d-flex align-items-center">
      {!isQueryFilterEqual ? (
        <i
          className="fa fa-filter"
          aria-hidden="true"
          title={I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.appliedQueryFilterTitle', {
            entityName: ordino.workbenches[ordino.focusWorkbenchIndex].name,
            globalQueryName: ordino.globalQueryName,
            selectedValues: ordino.appliedQueryCategories ? ordino.appliedQueryCategories.join(',') : '',
          })}
        />
      ) : null}
      <span className="m-1 text-truncate">
        {dataLength - filterLength} of {dataLength} {ordino.workbenches[ordino.focusWorkbenchIndex].name}s / {selectedLength}{' '}
        {ordino.workbenches[ordino.focusWorkbenchIndex].name}s selected
      </span>
    </div>
  );
}
