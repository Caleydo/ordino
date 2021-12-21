import React from 'react';
import { EDragTypes } from '../../app/workbench/utils';
import { useDrag } from 'react-dnd';
import { addView, useAppDispatch, useAppSelector } from '../..';
import { setWorkbenchDirection } from '../../store';
import { getAllFilters } from '../../store/storeUtils';
export function ChevronButtons({ color = 'cornflowerblue' }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.ADD,
        item: { type: EDragTypes.ADD },
    }));
    return (React.createElement(React.Fragment, null,
        React.createElement("div", null,
            React.createElement("button", { onClick: () => {
                    dispatch(addView({
                        workbenchIndex: ordino.focusViewIndex,
                        view: {
                            index: ordino.workbenches[ordino.focusViewIndex].views.length,
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
                " items filtered out"))));
}
//# sourceMappingURL=ChevronButtons.js.map