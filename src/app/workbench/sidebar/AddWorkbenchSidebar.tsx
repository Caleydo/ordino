import React from 'react';
import {useMemo} from 'react';
import {addTransitionOptions, addWorkbench, changeFocus, EWorkbenchDirection, IWorkbench, useAppDispatch, useAppSelector} from '../../..';
import {EXTENSION_POINT_TDP_VIEW, FindViewUtils, IDType, IViewPluginDesc, PluginRegistry, useAsync} from 'tdp_core';
import {colorPalette} from '../../Breadcrumb';
import {useState} from 'react';
import {IReprovisynMapping} from 'reprovisyn';

export interface IAddWorkbenchSidebarProps {
    workbench: IWorkbench;
}

export interface IMappingDesc {
    targetEntity: string;
    mappingEntity: string;
    mappingSubtype: string;
}

export function AddWorkbenchSidebar({
    workbench
}: IAddWorkbenchSidebarProps) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();

    const [relationList, setRelationList] = useState<IMappingDesc[]>([]);

    const relationListCallback = (s: IMappingDesc) => {
        if(!relationList.some((r) => r.mappingEntity === s.mappingEntity && r.mappingSubtype === s.mappingSubtype && s.targetEntity === r.targetEntity)) {
            setRelationList([...relationList, s]);
        } else {
            const arr = Array.from(relationList).filter((r) => r.mappingSubtype !== s.mappingSubtype);
            setRelationList(arr);
        }
    };

    const idType = useMemo(() => {
        return new IDType(workbench.entityId, '.*', '', true);
    }, []);

    const {status, value: availableViews} = useAsync(FindViewUtils.findAllViews, [idType]);

    const availableEntities: Set<string> = useMemo(() => {
        if(status !== 'success') {
            return null;
        }

        const entities: Set<string> = new Set();

        availableViews.forEach((v) => {
            entities.add(v.v.itemIDType);
        });

        return entities;
    }, [status, availableViews]);

    // console.log(availableViews, availableEntities);
    // console.log(relationList);

    return (
        <div className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
            {status === 'success' ?
            <div className={'d-flex flex-column'}>
                {Array.from(availableEntities).filter((d, i) => i === 0).map((e) => {
                    return (
                    <div className={'entityJumpBox p-1 mb-2 rounded'}>
                        <span className={'fs-2'} style={{color: colorPalette[workbench.index]}}>{e}</span>
                        {availableViews.filter((v) => v.v.itemIDType === e).map((v) => {
                            // console.log(v);
                            return (
                            <div>
                                <span>{v.v.name}</span>

                                {v.v.relation.mapping.map((map: IReprovisynMapping) => {
                                    const columns = v.v.isSourceToTarget ? map.sourceToTargetColumns : map.targetToSourceColumns;
                                    return (
                                        <>
                                            <div>{map.name}</div>
                                            {columns.map((col) => {
                                                return (
                                                    <div className="form-check">
                                                        <input onChange={() => relationListCallback({targetEntity: e, mappingEntity: map.entity, mappingSubtype: col.columnName})} className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                            {col.label}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    );

                                })}
                            </div>
                            );
                        })}
                        <button onClick={() => {
                            const viewPlugin: IViewPluginDesc = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, `reprovisyn_ranking_${relationList[0].targetEntity}`) as IViewPluginDesc;

                            dispatch(
                                addWorkbench({
                                    detailsOpen: true,
                                    addWorkbenchOpen: false,
                                    selectedMappings: relationList.map((r) => {
                                        return {
                                            entityId: r.mappingEntity,
                                            columnSelection: r.mappingSubtype
                                        };
                                    }),
                                    views: [{id: viewPlugin.id, uniqueId: (Math.random() + 1).toString(36).substring(7), filters: []}],
                                    viewDirection: EWorkbenchDirection.VERTICAL,
                                    transitionOptions: [],
                                    columnDescs: [],
                                    data: {},
                                    entityId: viewPlugin.id,
                                    name: viewPlugin.name,
                                    index: ordino.focusViewIndex + 1,
                                    selection: [],
                                })
                            );
                            setTimeout(() => {
                                dispatch(
                                    changeFocus({index: ordino.focusViewIndex + 1})
                                );
                            }, 0);

                        }} type="button" className="w-100 chevronButton btn btn-light btn-sm align-middle" >Create new {e} workbench</button>
                    </div>
                    );
                })}
            </div> : null}
        </div>
    );
}
