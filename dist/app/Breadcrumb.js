import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeFocus } from '../store/ordinoSlice';
export function Breadcrumb() {
    const ordino = useSelector((state) => state.ordino);
    const dispatch = useDispatch();
    return (React.createElement("nav", { className: "ms-1 d-flex", "aria-label": "breadcrumb" },
        React.createElement("ol", { className: "breadcrumb m-1" }, ordino.views.map((v) => {
            return (React.createElement("li", { className: "breadcrumb-item", key: v.id },
                React.createElement("button", { type: "button", className: `btn p-0 shadow-none ${ordino.focusViewIndex === v.index
                        ? 'btn-icon-primary fw-bold'
                        : ordino.focusViewIndex - 1 === v.index
                            ? 'btn-icon-success'
                            : 'btn-icon-gray'}`, onClick: () => dispatch(changeFocus({ index: v.index })) }, v.name)));
        }))));
}
//# sourceMappingURL=Breadcrumb.js.map