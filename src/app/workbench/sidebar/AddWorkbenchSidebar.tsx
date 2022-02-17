import React from 'react';
import {useMemo} from 'react';
import {addTransitionOptions, addWorkbench, changeFocus, EWorkbenchDirection, IWorkbench, useAppDispatch, useAppSelector} from '../../..';
import {EXTENSION_POINT_TDP_VIEW, FindViewUtils, IDType, IViewPluginDesc, PluginRegistry, useAsync} from 'tdp_core';
import {useState} from 'react';
import {IReprovisynEntity, IReprovisynMapping, ReprovisynRestUtils} from 'reprovisyn';
import {useEffect} from 'react';

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

    const availableEntities: {idType: string, label: string}[] = useMemo(() => {
        if(status !== 'success') {
            return null;
        }

        const entities: {idType: string, label: string}[] = [];

        availableViews.forEach((v) => {
            console.log(v);
            if(!entities.some((e) => e.idType === v.v.itemIDType && e.label === v.v.group.name)) {
                entities.push({idType: v.v.itemIDType, label: v.v.group.name});
            }
        });

        return entities;
    }, [status, availableViews]);

    console.log(availableEntities);

    console.log(ordino.colorMap);

    return (
        <div className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
            {status === 'success' ?
            <div className={'d-flex flex-column'}>
                {availableEntities.map((e) => {
                    return (
                    <div key={`${e.idType}Box`} className={'entityJumpBox p-1 mb-2 rounded'}>
                        <span className={'entityText'} style={{color: ordino.colorMap[e.idType]}}>{e.label}</span>
                        {availableViews.filter((v) => v.v.itemIDType === e.idType).map((v) => {
                            console.log(v);
                            return (
                            <div>
                                {v.v.relation.mapping.map((map: IReprovisynMapping) => {
                                    const columns = v.v.isSourceToTarget ? map.sourceToTargetColumns : map.targetToSourceColumns;
                                    return (
                                        <>
                                            <div className={'mt-2 mappingTypeText'}>{map.name}</div>
                                            {columns.map((col) => {
                                                return (
                                                    <div className="form-check">
                                                        <input onChange={() => relationListCallback({targetEntity: e.idType, mappingEntity: map.entity, mappingSubtype: col.columnName})} className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                                        <label className="mappingText form-check-label" htmlFor="flexCheckDefault">
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
                                    entityId: relationList[0].targetEntity,
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

                        }} type="button" style={{color: 'white', backgroundColor: ordino.colorMap[e.idType]}} className="mt-1 w-100 chevronButton btn btn-sm align-middle" >Create {e.label} workbench</button>
                    </div>
                    );
                })}
            </div> : null}
        </div>
    );
}
