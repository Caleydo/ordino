import React, {useEffect, useMemo} from 'react';
import { EDragTypes } from '../../app/workbench/utils';
import { useDrag } from 'react-dnd';
import {addView, EViewDirections, useAppDispatch, useAppSelector} from '../..';
import {addWorkbench, changeFocus, EWorkbenchDirection, setWorkbenchDirection} from '../../store';
import {EXTENSION_POINT_TDP_VIEW, IViewPluginDesc, PluginRegistry} from 'tdp_core';
import {IChevronBreadcrumbProps} from './ChevronBreadcrumb';
import {getAllFilters} from '../../store/storeUtils';

export interface ITempChevronJumpButtonsProps {
    color?: string;
}

export function TempChevronJumpButtons({
    color='cornflowerblue'
}: ITempChevronJumpButtonsProps) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.ADD,
        item: {type: EDragTypes.ADD},

    }));

    const possibleJumps = useMemo(() => {
        if(ordino.workbenches.length > 0) {

            const possibleJumps = ordino.workbenches[ordino.focusViewIndex].transitionOptions.map((o) => {
                return PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, `reprovisyn_ranking_${o}`) as IViewPluginDesc;
            });

            return possibleJumps;
        }

        return [];

    }, [ordino.workbenches, ordino.focusViewIndex]);


    return (
        <>
            {possibleJumps.map((j: IViewPluginDesc) => {
                return (
                        <button onClick={() => {
                            dispatch(
                                addWorkbench({
                                    viewDirection: EWorkbenchDirection.HORIZONTAL,
                                    views: [{id: j.id, name: j.name, viewType: 'Ranking', filters: [], index: 0}],
                                    transitionOptions: [],
                                    columnDescs: [],
                                    data: {},
                                    entityId: j.id,
                                    name: j.name,
                                    index: ordino.focusViewIndex + 1,
                                    selectionIds: [],
                                })
                            );
                            setTimeout(() => {
                                dispatch(
                                    changeFocus({index: ordino.focusViewIndex + 1})
                                );
                            }, 0);

                        }}type="button" className="chevronButton btn btn-light btn-sm align-middle m-1" style={{color}}>Jump to {j.name}</button>
                );
            })}

        </>
    );
}
