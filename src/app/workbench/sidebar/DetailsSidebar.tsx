import React, { Fragment, useMemo } from 'react';
import { useAsync } from 'tdp_core';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { IWorkbench } from '../../../store';
import { findWorkbenchTransitions } from '../../../views';
import { changeSelectedMappings } from '../../../store/ordinoTrrackedSlice';

export function DetailsSidebar({ workbench }: { workbench: IWorkbench }) {
  const prevWorkbench = useAppSelector((state) => (workbench.index === 0 ? null : state.ordinoTracked.workbenches[workbench.index - 1]));
  const colorMap = useAppSelector((state) => state.ordinoTracked.colorMap);

  const dispatch = useAppDispatch();
  const { status, value: availableViews } = useAsync(findWorkbenchTransitions, [prevWorkbench.entityId]);

  const selectionString = useMemo(() => {
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
  }, [prevWorkbench]);

  return (
    <div className="me-0" style={{ width: '250px' }}>
      {status === 'success' ? (
        <div className="d-flex flex-column">
          <div className="p-1 mb-2 rounded">
            <div className="d-flex flex-column" style={{ justifyContent: 'space-between' }}>
              <p className="mb-1">
                <span className="entityText">Selected </span>
                <span className="entityText" style={{ color: colorMap[prevWorkbench.entityId] }}>
                  {prevWorkbench.name}s
                </span>
              </p>
              <p className="mb-2 selectedPrevText">{selectionString}</p>
            </div>
            {availableViews
              .filter((v) => v.itemIDType === workbench.entityId)
              .map((v) => {
                return (
                  <div key={`${v.name}-mapping`}>
                    {v.relation?.mapping.map(({ name, entity, columns }) => {
                      return (
                        <Fragment key={`${entity}-${name}`}>
                          <div className="mt-2 mappingTypeText">{name}</div>
                          {columns.map((col) => {
                            const isChecked = workbench.selectedMappings.some((m) => m.columnSelection === col.columnName && m.entityId === entity);

                            return (
                              <div key={`${col.label}-column`} className="form-check ms-2">
                                <input
                                  checked={isChecked}
                                  onChange={() =>
                                    dispatch(
                                      changeSelectedMappings({
                                        workbenchIndex: workbench.index,
                                        newMapping: { columnSelection: col.columnName, entityId: entity },
                                      }),
                                    )
                                  }
                                  style={{
                                    backgroundColor: isChecked ? colorMap[workbench.entityId] : null,
                                    borderColor: isChecked ? colorMap[workbench.entityId] : null,
                                  }}
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
