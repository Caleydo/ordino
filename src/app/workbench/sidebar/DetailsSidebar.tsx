import React from 'react';
import { changeSelectedMappings, IWorkbench, useAppDispatch, useAppSelector} from '../../..';
import { FindViewUtils, IDType, useAsync } from 'tdp_core';
import {useMemo} from 'react';
import {IReprovisynMapping} from 'reprovisyn';

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

    const idType = useMemo(() => {
        return new IDType(ordino.workbenches[workbench.index - 1].entityId, '.*', '', true);
    }, []);

    const {status, value: availableViews} = useAsync(FindViewUtils.findAllViews, [idType]);

    const selectionString = useMemo(() => {
        let currString = '';

        ordino.workbenches[workbench.index - 1].selection.forEach((s) => {
            currString += s + ', ';
        });

        return currString.slice(0, currString.length - 3);
    }, [ordino.workbenches[workbench.index - 1].selection]);

    return (
        <div className="me-0 position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
            {status === 'success' ?
            <div className={'d-flex flex-column'}>
                <div className={'p-1 mb-2 rounded'}>
                    <div className="d-flex" style={{justifyContent: 'space-between'}}>
                        <p className={'mb-0 entityText'}>
                            <span className={'entityText'}>Selected </span>
                            <span className={'entityText'} style={{color: ordino.colorMap[ordino.workbenches[workbench.index - 1].entityId]}}>{ordino.workbenches[workbench.index - 1].name}s</span>
                        </p>
                        <p className={'mb-0 mappingText'} style={{color: ordino.colorMap[ordino.workbenches[workbench.index - 1].entityId]}}>{selectionString}</p>
                    </div>
                    {availableViews.filter((v) => v.v.itemIDType === workbench.entityId).map((v) => {
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
                </div>
            </div>
            : null }
        </div>
    );
}
