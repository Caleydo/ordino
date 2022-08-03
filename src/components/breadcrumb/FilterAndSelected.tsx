import React, { useMemo } from 'react';
import { I18nextManager } from 'tdp_core';
import _ from 'lodash';
import { getAllFilters } from '../../store/storeUtils';
import { useAppSelector } from '../../hooks/useAppSelector';

/**
 * TODO:: This should probably just be passed a workbench, not access the store
 * @returns
 */
export function FilterAndSelected() {
  const currentWorkbench = useAppSelector((state) => state.ordinoTracked.workbenches[state.ordinoTracked.focusWorkbenchIndex]);
  const untrackedState = useAppSelector((state) => state.ordinoTracked);

  const dataLength = useMemo(() => {
    return Object.keys(currentWorkbench.data).length;
  }, [currentWorkbench]);

  const filterLength = useMemo(() => {
    return getAllFilters(currentWorkbench).length;
  }, [currentWorkbench]);

  const selectedLength = useMemo(() => {
    return currentWorkbench.selection.length;
  }, [currentWorkbench]);

  const isQueryFilterEqual = useMemo(() => {
    return _.isEqual(untrackedState.globalQueryCategories, untrackedState.appliedQueryCategories);
  }, [untrackedState.globalQueryCategories, untrackedState.appliedQueryCategories]);

  return (
    <div className="text-truncate align-middle m-1 d-flex align-items-center">
      {!isQueryFilterEqual ? (
        <i
          className="fa fa-filter pe-auto"
          aria-hidden="true"
          title={I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.appliedQueryFilterTitle', {
            entityName: currentWorkbench.name,
            globalQueryName: untrackedState.globalQueryName,
            selectedValues: untrackedState.appliedQueryCategories ? untrackedState.appliedQueryCategories.join(',') : '',
          })}
        />
      ) : null}
      <span className="m-1 text-truncate">
        {dataLength - filterLength} of {dataLength} {currentWorkbench.name}s / {selectedLength}
        {currentWorkbench.name}s selected
      </span>
    </div>
  );
}
