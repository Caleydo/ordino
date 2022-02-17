import React from 'react';
import {useMemo} from 'react';
import {addTransitionOptions, addWorkbench, changeFocus, EWorkbenchDirection, IWorkbench, useAppDispatch, useAppSelector} from '../../..';
import {EXTENSION_POINT_TDP_VIEW, FindViewUtils, IDType, IViewPluginDesc, PluginRegistry, useAsync} from 'tdp_core';
import {useState} from 'react';
import {changeSelectedMappings} from '../../../store';
import {IReprovisynMapping} from 'reprovisyn';
import {current} from '@reduxjs/toolkit';

export interface IDetailsSidebarProps {
    workbench: IWorkbench;
}

export interface IMappingDesc {
    mappingName: string;
    mappingSubtype: string;
}

export function DetailsSidebar({
    workbench
}: IDetailsSidebarProps) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();

    const [relationList, setRelationList] = useState<IMappingDesc[]>([]);

    const relationListCallback = (s: IMappingDesc) => {
        if(!relationList.some((r) => r.mappingName === s.mappingName && r.mappingSubtype === s.mappingSubtype)) {
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

    const currentEntity: {idType: string, label: string} = useMemo(() => {
        if(!availableViews) {
            return null;
        }

        const currEntity = availableViews.find((v) => {
            return v.v.idtype === workbench.entityId;
        });

        return {idType: currEntity.v.idtype, label: currEntity.v.group.name};

    }, [status, availableViews]);


    console.log(availableViews, currentEntity);

    return (
        <div className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
            {status === 'success' ?
            <div className={'d-flex flex-column'}>
                <div className={'entityJumpBox p-1 mb-2 rounded'}>
                    <span className={'entityText'} style={{color: ordino.colorMap[currentEntity.idType]}}>{currentEntity.label}</span>
                    {availableViews.filter((v) => v.v.itemIDType === currentEntity.idType).map((v) => {
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
                                                    <input checked={workbench.selectedMappings.some((m) => m.columnSelection === col.columnName && m.entityId === map.entity)} onChange={() => dispatch(changeSelectedMappings({workbenchIndex: ordino.focusViewIndex, newMapping: {columnSelection: col.columnName, entityId: map.entity}}))} className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
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
                </div>
            </div> : null}
            {/* {status === 'success' ?
            <div className={'d-flex flex-column'}>
                {Array.from(availableEntities).filter((d, i) => i === 0).map((e) => {
                    return (
                    <div className={'entityJumpBox p-1 mb-2 rounded'}>
                        <span className={'fs-2'} style={{color: colorPalette[workbench.index]}}>{e}</span>
                        {availableViews.filter((v) => v.v.itemIDType === e).map((v) => {
                            return (
                            <div>
                                <span>{v.v.name}</span>
                                {v.v.mapping.targetToSourceColumns.map((col) => {
                                    return (
                                        <div className="form-check">
                                            <input checked={workbench.selectedMappings.includes(col.columnName)} onChange={() => dispatch(changeSelectedMappings({workbenchIndex: ordino.focusViewIndex, newMapping: col.columnName}))} className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                {col.label}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            );
                        })}
                    </div>
                    );
                })}
            </div> : null} */}
        </div>
    );
}
