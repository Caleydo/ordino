import React, { useMemo } from 'react';
import { EDragTypes } from '../../app/workbench/utils';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../..';
import { addWorkbench, changeFocus, EWorkbenchDirection } from '../../store';
import { EXTENSION_POINT_TDP_VIEW, PluginRegistry } from 'tdp_core';
export function TempChevronJumpButtons({ color = 'cornflowerblue' }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.ADD,
        item: { type: EDragTypes.ADD },
    }));
    const possibleJumps = useMemo(() => {
        if (ordino.workbenches.length > 0) {
            const possibleJumps = ordino.workbenches[ordino.focusViewIndex].transitionOptions.map((o) => {
                return PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, `reprovisyn_ranking_${o}`);
            });
            return possibleJumps.filter((o) => o !== undefined);
        }
        return [];
    }, [ordino.workbenches, ordino.focusViewIndex]);
    return (React.createElement(React.Fragment, null, possibleJumps.map((j) => {
        return (React.createElement("button", { key: `${j.id}Jump`, onClick: () => {
                dispatch(addWorkbench({
                    selectedMappings: [],
                    views: [{ id: j.id, uniqueId: (Math.random() + 1).toString(36).substring(7), filters: [] }],
                    viewDirection: EWorkbenchDirection.VERTICAL,
                    transitionOptions: [],
                    columnDescs: [],
                    data: {},
                    entityId: j.id,
                    name: j.name,
                    index: ordino.focusViewIndex + 1,
                    selection: [],
                }));
                setTimeout(() => {
                    dispatch(changeFocus({ index: ordino.focusViewIndex + 1 }));
                }, 0);
            }, type: "button", className: "chevronButton btn btn-light btn-sm align-middle m-1", style: { color } },
            "Jump to ",
            j.name));
    })));
}
//# sourceMappingURL=TempChevronJumpButtons.js.map