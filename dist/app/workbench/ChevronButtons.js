import React, { useMemo } from 'react';
import { EDragTypes } from './utils';
import { useDrag } from 'react-dnd';
import { addView, useAppDispatch, useAppSelector } from '../..';
import { addWorkbench, changeFocus, setWorkbenchDirection } from '../../store';
import { EXTENSION_POINT_TDP_VIEW, PluginRegistry } from 'tdp_core';
import { getAllFilters } from '../../store/storeUtils';
export function ChevronButtons({ color = 'cornflowerblue' }) {
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
            return possibleJumps;
        }
        return [];
    }, [ordino.workbenches, ordino.focusViewIndex]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", null,
            React.createElement("button", { onClick: () => {
                    dispatch(addView({
                        workbenchIndex: ordino.focusViewIndex,
                        view: {
                            id: ('Vis' + Math.random()).substring(2, 7),
                            filters: [],
                            viewType: 'Vis',
                        }
                    }));
                }, type: "button", className: "chevronButton btn btn-light btn-sm align-middle m-1", style: { color } },
                " ",
                React.createElement("i", { className: "flex-grow-1 fas fa-chart-bar" }),
                " Add View")),
        React.createElement("div", null,
            React.createElement("button", { type: "button", className: "chevronButton btn btn-light btn-sm align-middle m-1", style: { color } },
                " ",
                React.createElement("i", { className: "flex-grow-1 fas fa-plus" }),
                " Add Column")),
        React.createElement("div", null,
            React.createElement("button", { onClick: () => {
                    dispatch(setWorkbenchDirection({ workbenchIndex: ordino.focusViewIndex, direction: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'horizontal' ? 'vertical' : 'horizontal' }));
                }, type: "button", className: "chevronButton btn btn-light btn-sm align-middle m-1", style: { color } },
                " ",
                React.createElement("i", { className: "flex-grow-1 fas fa-compass" }),
                " Direction")),
        React.createElement("div", { className: 'align-middle m-1 d-flex align-items-center' },
            React.createElement("i", { className: "flex-grow-1 fas fa-filter" }),
            React.createElement("span", { className: "m-1" },
                getAllFilters(ordino.workbenches[ordino.focusViewIndex]).length,
                " items filtered out")),
        possibleJumps.map((j) => {
            return (React.createElement("div", null,
                React.createElement("button", { onClick: () => {
                        dispatch(addWorkbench({
                            viewDirection: 'horizontal',
                            views: [{ id: j.id, name: j.name, viewType: 'Ranking', filters: [] }],
                            transitionOptions: [],
                            columnDescs: [],
                            data: {},
                            entityId: j.id,
                            name: j.name,
                            index: ordino.focusViewIndex + 1,
                            selections: [],
                        }));
                        setTimeout(() => {
                            dispatch(changeFocus({ index: ordino.focusViewIndex + 1 }));
                        }, 0);
                    }, type: "button", className: "chevronButton btn btn-light btn-sm align-middle m-1", style: { color, marginLeft: 'auto' } },
                    "Jump to ",
                    j.name)));
        })));
}
//# sourceMappingURL=ChevronButtons.js.map