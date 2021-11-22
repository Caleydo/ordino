import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { changeFocus } from '../store/ordinoSlice';
import { AddButton } from './workbench/AddButton';
export function BreadcrumbSvg() {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    return (React.createElement("nav", { className: "ms-1 d-flex", "aria-label": "breadcrumb" },
        React.createElement("ol", { className: "breadcrumb m-2" },
            ordino.workbenches.map((v) => {
                return (React.createElement("li", { className: "breadcrumb-item", key: v.index },
                    React.createElement("button", { type: "button", className: `btn p-0 shadow-none ${ordino.focusViewIndex === v.index
                            ? 'btn-icon-primary fw-bold'
                            : ordino.focusViewIndex - 1 === v.index
                                ? 'btn-icon-success'
                                : 'btn-icon-gray'}`, onClick: () => dispatch(changeFocus({ index: v.index })) }, v.name)));
            }),
            React.createElement("li", { className: "breadcrumb-item" },
                React.createElement(AddButton, null)))));
}
//# sourceMappingURL=BreadcrumbSvg.js.map