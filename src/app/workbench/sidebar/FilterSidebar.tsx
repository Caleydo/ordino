import { intersection } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { GlobalQuerySelect } from 'reprovisyn';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { IWorkbench, setGlobalFilters } from '../../../store';

export function FilterSidebar({ workbench }: { workbench: IWorkbench }) {
  const dispatch = useAppDispatch();
  const { globalQueryName, globalQueryCategories, appliedQueryCategories } = useAppSelector((state) => state.ordino);
  const [selectedCategories, setSelectedCategories] = useState(appliedQueryCategories);

  useEffect(() => {
    setSelectedCategories(appliedQueryCategories);
  }, [appliedQueryCategories]);

  const changeQueryFilterSelection = (values: (number | string)[]) => {
    setSelectedCategories(values);
  };

  const includesCurrentFilter = useMemo(() => {
    return appliedQueryCategories?.length === intersection(appliedQueryCategories, selectedCategories)?.length || selectedCategories?.length === 0;
  }, [selectedCategories, appliedQueryCategories]);

  const hasGlobalFilter = useMemo(() => globalQueryName && globalQueryCategories?.length, [globalQueryCategories, globalQueryName]);
  const readonly = workbench.index > 0;
  return (
    <div style={{ width: '320px' }} className="d-flex flex-column p-2">
      {hasGlobalFilter ? (
        <>
          {readonly ? (
            <div className="alert alert-secondary" role="alert">
              This workbench has the below active filter. Go to the first workbench to change this filter.
            </div>
          ) : null}
          <GlobalQuerySelect
            globalQueryName={globalQueryName}
            globalQueryCategories={globalQueryCategories}
            selectedCategories={selectedCategories}
            onChangeQueryFilterSelection={changeQueryFilterSelection}
            readonly={readonly}
          />
          {includesCurrentFilter || readonly ? null : (
            <div className="alert alert-warning d-flex align-items-center mt-2" role="alert">
              <div>
                <strong>Attention</strong>: This filter will cause all open subsequent workbenches to be closed.
              </div>
            </div>
          )}
          {!readonly ? (
            <button type="button" className="btn btn-secondary mt-2" onClick={() => dispatch(setGlobalFilters({ appliedQueryCategories: selectedCategories }))}>
              Apply
            </button>
          ) : null}
        </>
      ) : (
        <p>No available filters for your dataset</p>
      )}
    </div>
  );
}
