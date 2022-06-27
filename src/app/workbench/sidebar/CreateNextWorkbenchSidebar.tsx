import React, { FormEvent, Fragment, useMemo, useState } from 'react';
import { IDTypeManager, useAsync } from 'tdp_core';
import { changeFocus, EWorkbenchDirection, IWorkbench, addWorkbench, setCreateNextWorkbenchSidebarOpen } from '../../../store';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { findWorkbenchTransitions, OrdinoVisynViewPluginDesc } from '../../../views';
import { getVisynView } from '../WorkbenchView';

export interface ICreateNextWorkbenchSidebarProps {
  workbench: IWorkbench;
}

export interface IMappingDesc {
  targetEntity: string;
  mappingEntity: string;
  mappingSubtype: string;
}

export function CreateNextWorkbenchSidebar({ workbench }: ICreateNextWorkbenchSidebarProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  const [selectedView, setSelectedView] = useState<OrdinoVisynViewPluginDesc>(null);
  const [relationList, setRelationList] = useState<IMappingDesc[]>([]);

  const relationListCallback = (s: IMappingDesc) => {
    if (!relationList.some((r) => r.mappingEntity === s.mappingEntity && r.mappingSubtype === s.mappingSubtype && s.targetEntity === r.targetEntity)) {
      setRelationList([...relationList, s]);
    } else {
      const arr = Array.from(relationList).filter((r) => r.mappingSubtype !== s.mappingSubtype);
      setRelationList(arr);
    }
  };

  const { status, value: availableViews } = useAsync(getVisynView, [workbench.entityId]);

  const availableEntities: { idType: string; label: string }[] = useMemo(() => {
    if (status !== 'success') {
      return null;
    }

    const entities: { idType: string; label: string }[] = [];

    availableViews.forEach((v) => {
      if (!entities.some((e) => e.idType === v.itemIDType && e.label === v.group.name)) {
        entities.push({ idType: v.itemIDType, label: v.group.name });
      }
    });

    return entities;
  }, [status, availableViews]);

  console.log(availableViews);

  const selectionString = useMemo(() => {
    const prevFormatting = workbench.formatting;

    const currString = workbench.selection
      .map((selectedId) => {
        // the column value might be empty, so we also default to selectedId if this is the case
        return prevFormatting ? workbench.data[selectedId][prevFormatting.titleColumn || prevFormatting.idColumn] || selectedId : selectedId;
      })
      .join(', ');

    return currString.length < 202 ? currString : `${currString.slice(0, 200)}...`;
  }, [workbench.data, workbench.formatting, workbench.selection]);

  return (
    <div className="ms-0 position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
      {status === 'success' ? (
        <div className="d-flex flex-column">
          {availableViews.map((e) => {
            return (
              <div key={`${e.idType}Box`} className="entityJumpBox p-1 mb-2 rounded">
                <div className="d-flex flex-column" style={{ justifyContent: 'space-between' }}>
                  <p className="mt-1 mb-1">
                    <span className="p-1 entityText" style={{ color: '#e9ecef', backgroundColor: ordino.colorMap[e.idType] }}>
                      {e.label}
                    </span>
                  </p>
                  <p className="mb-2 selectedPrevText" style={{ color: ordino.colorMap[workbench.entityId] }}>
                    {selectionString}
                  </p>
                </div>
                <form
                  onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const selectedMappings = relationList.map((r) => {
                      return {
                        entityId: r.mappingEntity,
                        columnSelection: r.mappingSubtype,
                      };
                    });
                    dispatch(
                      // load the data
                      addWorkbench({
                        itemIDType: selectedView.itemIDType,
                        detailsSidebarOpen: true,
                        createNextWorkbenchSidebarOpen: false,
                        selectedMappings,
                        views: [
                          {
                            name: selectedView.name,
                            id: selectedView.id,
                            parameters: {
                              prevSelection: workbench.selection,
                              selectedMappings,
                              globalQuery: ordino.globalQuery,
                              appliedQueryFilter: ordino.appliedQueryFilter,
                            },
                            uniqueId: (Math.random() + 1).toString(36).substring(7),
                            filters: [],
                          },
                        ],
                        viewDirection: EWorkbenchDirection.VERTICAL,
                        columnDescs: [],
                        data: {},
                        entityId: relationList[0].targetEntity,
                        name: selectedView.itemName,
                        index: workbench.index + 1,
                        selection: [],
                      }),
                    );
                    setTimeout(() => {
                      dispatch(changeFocus({ index: ordino.focusWorkbenchIndex + 1 }));
                      dispatch(setCreateNextWorkbenchSidebarOpen({ workbenchIndex: workbench.index, open: false }));
                    }, 0);
                  }}
                >
                  {/* {availableViews
                    .filter((v) => v.itemIDType === e.idType)
                    .map((v) => {
                      return (
                        <div key={`${v.name}-mapping`}>
                          {v.relation?.mapping.map(({ name, entity, sourceToTargetColumns, targetToSourceColumns }) => {
                            const columns = v.isSourceToTarget ? sourceToTargetColumns : targetToSourceColumns;
                            return (
                              <Fragment key={`${name}-group`}>
                                <div className="mt-2 mappingTypeText">{name}</div>
                                {columns.map((col) => {
                                  return (
                                    <div key={`${col.label}Column`} className="form-check">
                                      <input
                                        onChange={() => {
                                          relationListCallback({ targetEntity: e.idType, mappingEntity: entity, mappingSubtype: col.columnName });
                                          setSelectedView(v);
                                        }}
                                        className="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id={`${col.label}${v.name}Check`}
                                      />
                                      <label className="mappingText form-check-label" htmlFor={`${col.label}${v.name}Check`}>
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
                    })} */}
                  {/* <button
                    type="submit"
                    style={{ color: 'white', backgroundColor: ordino.colorMap[e.idType] }}
                    className={`mt-1 w-100 chevronButton btn btn-sm align-middle ${relationList.length === 0 ? 'disabled' : ''}`}
                  >
                    Create {e.label} workbench
                  </button> */}
                </form>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
