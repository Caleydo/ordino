import React, { FormEvent, Fragment, useMemo, useState } from 'react';
import { FindViewUtils, IDTypeManager, IViewPluginDesc, useAsync } from 'tdp_core';
import { IReprovisynMapping } from 'reprovisyn';
import { changeFocus, EWorkbenchDirection, IWorkbench, addWorkbench } from '../../../store';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

export interface IAddWorkbenchSidebarProps {
  workbench: IWorkbench;
}

export interface IMappingDesc {
  targetEntity: string;
  mappingEntity: string;
  mappingSubtype: string;
}

export function AddWorkbenchSidebar({ workbench }: IAddWorkbenchSidebarProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const dispatch = useAppDispatch();

  const [selectedView, setSelectedView] = useState<IViewPluginDesc>(null);
  const [relationList, setRelationList] = useState<IMappingDesc[]>([]);

  const relationListCallback = (s: IMappingDesc) => {
    if (!relationList.some((r) => r.mappingEntity === s.mappingEntity && r.mappingSubtype === s.mappingSubtype && s.targetEntity === r.targetEntity)) {
      setRelationList([...relationList, s]);
    } else {
      const arr = Array.from(relationList).filter((r) => r.mappingSubtype !== s.mappingSubtype);
      setRelationList(arr);
    }
  };

  const idType = useMemo(() => IDTypeManager.getInstance().resolveIdType(workbench.itemIDType), [workbench.itemIDType]);

  const findDependentViews = React.useMemo(
    () => () =>
      FindViewUtils.findVisynViews(idType).then((views) =>
        views.filter((v) => {
          return v.v.defaultView;
        }),
      ),
    [idType],
  );

  const { status, value: availableViews } = useAsync(findDependentViews, []);

  const availableEntities: { idType: string; label: string }[] = useMemo(() => {
    if (status !== 'success') {
      return null;
    }

    const entities: { idType: string; label: string }[] = [];

    availableViews.forEach((v) => {
      if (!entities.some((e) => e.idType === v.v.itemIDType && e.label === v.v.group.name)) {
        entities.push({ idType: v.v.itemIDType, label: v.v.group.name });
      }
    });

    return entities;
  }, [status, availableViews]);

  const selectionString = useMemo(() => {
    let currString = '';

    workbench.selection.forEach((s) => {
      currString += `${s}, `;
    });

    return currString.length < 203 ? currString.slice(0, currString.length - 3) : `${currString.slice(0, 200)}...`;
  }, [workbench.selection]);

  return (
    <div className="ms-0 position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
      {status === 'success' ? (
        <div className="d-flex flex-column">
          {availableEntities.map((e) => {
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
                        detailsOpen: true,
                        addWorkbenchOpen: false,
                        selectedMappings,
                        views: [
                          {
                            name: selectedView.itemName,
                            id: selectedView.id,
                            parameters: { prevSelection: workbench.selection, selectedMappings },
                            uniqueId: (Math.random() + 1).toString(36).substring(7),
                            filters: [],
                          },
                        ],
                        viewDirection: EWorkbenchDirection.VERTICAL,
                        transitionOptions: [],
                        columnDescs: [],
                        data: {},
                        entityId: relationList[0].targetEntity,
                        name: selectedView.itemName,
                        index: workbench.index + 1,
                        selection: [],
                      }),
                    );
                    setTimeout(() => {
                      dispatch(changeFocus({ index: ordino.focusViewIndex + 1 }));
                    }, 0);
                  }}
                >
                  {availableViews
                    .filter((v) => v.v.itemIDType === e.idType)
                    .map((v) => {
                      return (
                        <div key={`${v.v.name}-mapping`}>
                          {v.v.relation.mapping.map((map: IReprovisynMapping) => {
                            const columns = v.v.isSourceToTarget ? map.sourceToTargetColumns : map.targetToSourceColumns;
                            return (
                              <Fragment key={`${map.name}-group`}>
                                <div className="mt-2 mappingTypeText">{map.name}</div>
                                {columns.map((col) => {
                                  return (
                                    <div key={`${col.label}Column`} className="form-check">
                                      <input
                                        onChange={() => {
                                          relationListCallback({ targetEntity: e.idType, mappingEntity: map.entity, mappingSubtype: col.columnName });
                                          setSelectedView(v.v);
                                        }}
                                        className="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id={`${col.label}${v.v.name}Check`}
                                      />
                                      <label className="mappingText form-check-label" htmlFor={`${col.label}${v.v.name}Check`}>
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
                  <button
                    type="submit"
                    style={{ color: 'white', backgroundColor: ordino.colorMap[e.idType] }}
                    className={`mt-1 w-100 chevronButton btn btn-sm align-middle ${relationList.length === 0 ? 'disabled' : ''}`}
                  >
                    Create {e.label} workbench
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
