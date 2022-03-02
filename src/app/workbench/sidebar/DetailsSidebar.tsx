import React, { Fragment, useMemo } from 'react';
import { FindViewUtils, IDType, useAsync } from 'tdp_core';
import { IReprovisynMapping } from 'reprovisyn';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { changeSelectedMappings, IWorkbench } from '../../../store/ordinoSlice';

export interface IDetailsSidebarProps {
  workbench: IWorkbench;
}

export interface IMappingDesc {
  mappingName: string;
  mappingSubtype: string;
}

export function DetailsSidebar({ workbench }: IDetailsSidebarProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  const idType = useMemo(() => {
    return new IDType(ordino.workbenches[workbench.index - 1].entityId, '.*', '', true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const findDependentViews = React.useMemo(() => () => FindViewUtils.findVisynViews(idType).then((views) => views.filter((v) => v.v.defaultView)), [idType]);
  const { status, value: availableViews } = useAsync(findDependentViews, []);

  const selectionString = useMemo(() => {
    let currString = '';

    ordino.workbenches[workbench.index - 1].selection.forEach((s) => {
      currString += `${s}, `;
    });

    return currString.length < 153 ? currString.slice(0, currString.length - 3) : `${currString.slice(0, 150)}...`;
  }, [ordino.workbenches, workbench.index]);

  return (
    <div className="me-0 position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
      {status === 'success' ? (
        <div className="d-flex flex-column">
          <div className="p-1 mb-2 rounded">
            <div className="d-flex flex-column" style={{ justifyContent: 'space-between' }}>
              <p className="mb-1">
                <span className="entityText">Selected </span>
                <span
                  className="p-1 entityText"
                  style={{ color: '#e9ecef', backgroundColor: ordino.colorMap[ordino.workbenches[workbench.index - 1].entityId] }}
                >
                  {ordino.workbenches[workbench.index - 1].name}s
                </span>
              </p>
              <p className="mb-2 selectedPrevText">{selectionString}</p>
            </div>
            {availableViews
              .filter((v) => v.v.itemIDType === workbench.entityId)
              .map((v) => {
                return (
                  <div key={`${v.v.name}mapping`}>
                    {v.v.relation.mapping.map((map: IReprovisynMapping) => {
                      const columns = v.v.isSourceToTarget ? map.sourceToTargetColumns : map.targetToSourceColumns;
                      return (
                        <Fragment key={`${map.entity}-${map.name}`}>
                          <div className="mt-2 mappingTypeText">{map.name}</div>
                          {columns.map((col) => {
                            return (
                              <div key={`${col.label}Column`} className="form-check">
                                <input
                                  checked={workbench.selectedMappings.some((m) => m.columnSelection === col.columnName && m.entityId === map.entity)}
                                  onChange={() =>
                                    dispatch(
                                      changeSelectedMappings({
                                        workbenchIndex: ordino.focusViewIndex,
                                        newMapping: { columnSelection: col.columnName, entityId: map.entity },
                                      }),
                                    )
                                  }
                                  className="form-check-input"
                                  type="checkbox"
                                  value=""
                                  id="flexCheckDefault"
                                />
                                <label className="mappingText form-check-label" htmlFor="flexCheckDefault">
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
