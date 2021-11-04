import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addView, changeFocus } from '../store/ordinoSlice';
export function Breadcrumb() {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    return (React.createElement(React.Fragment, null,
        React.createElement("nav", { className: "ms-1 d-flex", "aria-label": "breadcrumb" },
            React.createElement("ol", { className: "breadcrumb m-2" }, ordino.workbenches.map((w) => {
                return (React.createElement("li", { className: "breadcrumb-item", key: w.id },
                    React.createElement("button", { type: "button", className: `btn p-0 shadow-none ${ordino.focusViewIndex === w.index
                            ? 'btn-icon-primary fw-bold'
                            : ordino.focusViewIndex - 1 === w.index
                                ? 'btn-icon-success'
                                : 'btn-icon-gray'}`, onClick: () => dispatch(changeFocus({ index: w.index })) }, w.name)));
            }))),
        React.createElement("button", { type: "button", onClick: () => {
                dispatch(addView({
                    workbenchIndex: ordino.focusViewIndex,
                    view: {
                        id: 'view_0',
                        index: 0,
                        name: 'Start view',
                        selection: 'multiple',
                        selections: [],
                        group: {
                            name: 'General',
                            order: 10
                        }
                    }
                }));
            }, className: "btn btn-primary" }, "Add View"),
        React.createElement("button", { type: "button", onClick: () => {
                console.log('hello');
            }, className: "btn btn-primary" }, "Remove View")));
}
//# sourceMappingURL=Breadcrumb.js.map