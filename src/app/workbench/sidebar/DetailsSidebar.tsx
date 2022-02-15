import React from 'react';
import {useMemo} from 'react';
import {addTransitionOptions, addWorkbench, changeFocus, EWorkbenchDirection, IWorkbench, useAppDispatch, useAppSelector} from '../../..';
import {EXTENSION_POINT_TDP_VIEW, FindViewUtils, IDType, IViewPluginDesc, PluginRegistry, useAsync} from 'tdp_core';
import {colorPalette} from '../../Breadcrumb';
import {useState} from 'react';
import {changeSelectedMappings} from '../../../store';

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


    return (
        <div className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
            {status === 'success' ?
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
            </div> : null}
        </div>
    );
}
