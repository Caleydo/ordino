import React, { Fragment, useMemo } from 'react';
import { useAsync } from 'tdp_core';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { changeSelectedMappings, IWorkbench } from '../../../store';
import { findWorkbenchTransitions } from '../../../views';

export function DetailsSidebar({ workbench }: { workbench: IWorkbench }) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();
  const { status, value: availableViews } = useAsync(findWorkbenchTransitions, [ordino.workbenches[workbench.index - 1].entityId]);

  const selectionString = useMemo(() => {
    const prevWorkbench = ordino.workbenches[workbench.index - 1];
    if (!prevWorkbench) {
      return '';
    }
    const prevFormatting = prevWorkbench.formatting;

    const currString = prevWorkbench.selection
      .map((selectedId) => {
        // the column value might be empty, so we also default to selectedId if this is the case
        return prevFormatting ? prevWorkbench.data[selectedId][prevFormatting.titleColumn || prevFormatting.idColumn] || selectedId : selectedId;
      })
      .join(', ');

    return currString.length < 152 ? currString : `${currString.slice(0, 150)}...`;
  }, [ordino.workbenches, workbench.index]);

  return (
    <div className="me-0" style={{ width: '250px' }}>
      {status === 'success' ? (
        <div className="d-flex flex-column">
          <div className="p-1 mb-2 rounded">
            <div className="d-flex flex-column" style={{ justifyContent: 'space-between' }}>
              <p className="mb-1">
                <span className="entityText">Selected </span>
                <span className="entityText" style={{ color: ordino.colorMap[ordino.workbenches[workbench.index - 1].entityId] }}>
                  {ordino.workbenches[workbench.index - 1].name}s
                </span>
              </p>
              <p className="mb-2 selectedPrevText">{selectionString}</p>
            </div>
            {availableViews
              .filter((v) => v.itemIDType === workbench.entityId)
              .map((v) => {
                return (
                  <div key={`${v.name}-mapping`}>
                    {v.relation?.mapping.map(({ name, entity, sourceToTargetColumns, targetToSourceColumns }) => {
                      const columns = v.isSourceToTarget ? sourceToTargetColumns : targetToSourceColumns;
                      return (
                        <Fragment key={`${entity}-${name}`}>
                          <div className="mt-2 mappingTypeText">{name}</div>
                          {columns.map((col) => {
                            return (
                              <div key={`${col.label}-column`} className="form-check ms-2">
                                <input
                                  checked={workbench.selectedMappings.some((m) => m.columnSelection === col.columnName && m.entityId === entity)}
                                  onChange={() =>
                                    dispatch(
                                      changeSelectedMappings({
                                        workbenchIndex: ordino.midTransition ? ordino.focusWorkbenchIndex + 1 : ordino.focusWorkbenchIndex,
                                        newMapping: { columnSelection: col.columnName, entityId: entity },
                                      }),
                                    )
                                  }
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id={`checkbox-${col.label}-${v.name}`}
                                />
                                <label className="mappingText form-check-label" htmlFor={`checkbox-${col.label}-${v.name}`}>
                                  {col.label}
                                </label>
                              </div>
                            );
                          })}
                        </Fragment>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
