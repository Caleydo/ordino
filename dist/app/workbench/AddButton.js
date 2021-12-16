import React, { useMemo } from 'react';
import { EDragTypes } from './utils';
import { useDrag } from 'react-dnd';
import { addView, useAppDispatch, useAppSelector } from '../..';
import { addWorkbench, changeFocus, setWorkbenchDirection } from '../../store';
import { EXTENSION_POINT_TDP_VIEW, PluginRegistry } from 'tdp_core';
export function AddButton() {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.ADD,
        item: { type: EDragTypes.ADD },
    }));
    const possibleJumps = useMemo(() => {
        if (ordino.workbenches.length > 0) {
            console.log(ordino);
            const possibleJumps = ordino.workbenches[ordino.focusViewIndex].transitionOptions.map((o) => {
                console.log(o);
                return PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, `reprovisyn_ranking_${o}`);
            });
            return possibleJumps;
        }
        return [];
    }, [ordino.workbenches, ordino.focusViewIndex]);
    console.log(possibleJumps);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { onClick: () => {
                dispatch(addView({
                    workbenchIndex: ordino.focusViewIndex,
                    view: {
                        id: 'reprovisyn_ranking_viralland.public.samples',
                        viewType: 'Ranking',
                        index: ordino.workbenches[ordino.focusViewIndex].views.length,
                        name: 'Gene',
                        selection: 'multiple',
                        selections: [],
                        group: {
                            name: 'General',
                            order: 10
                        }
                    }
                }));
            }, type: "button", className: "btn btn-primary" }, "Add Ranking"),
        React.createElement("button", { onClick: () => {
                dispatch(addView({
                    workbenchIndex: ordino.focusViewIndex,
                    view: {
                        viewType: 'Vis',
                    }
                }));
            }, type: "button", className: "btn btn-primary" }, "Add Vis"),
        React.createElement("button", { onClick: () => {
                dispatch(setWorkbenchDirection({ workbenchIndex: ordino.focusViewIndex, direction: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'horizontal' ? 'vertical' : 'horizontal' }));
            }, type: "button", className: "btn btn-primary" }, "Direction"),
        possibleJumps.map((j) => {
            return (React.createElement("button", { onClick: () => {
                    dispatch(addWorkbench({
                        viewDirection: 'horizontal',
                        views: [{ id: j.id, name: j.name, viewType: 'Ranking' }],
                        transitionOptions: [],
                        columnDescs: [],
                        data: {},
                        entityId: j.id,
                        name: j.name,
                        index: ordino.focusViewIndex + 1,
                        selections: [],
                        filters: []
                    }));
                    dispatch(changeFocus({ index: ordino.focusViewIndex + 1 }));
                }, type: "button", className: "btn btn-primary" },
                "Jump to ",
                j.name));
        })));
}
//# sourceMappingURL=AddButton.js.map