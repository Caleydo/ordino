import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { AddViewButton } from './AddViewButton';
import { ChevronBreadcrumb } from './ChevronBreadcrumb';
import { ShowDetailsSwitch } from './ShowDetailsSwitch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FilterAndSelected } from './FilterAndSelected';
export function SingleBreadcrumb({ first = false, flexWidth = 1, onClick = null, color = 'cornflowerblue', workbench = null }) {
    var _a;
    const ordino = useAppSelector((state) => state.ordino);
    const [width, setWidth] = useState();
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.offsetWidth);
        }
    }, [(_a = ref === null || ref === void 0 ? void 0 : ref.current) === null || _a === void 0 ? void 0 : _a.offsetWidth]);
    return (React.createElement("div", { className: `position-relative ${onClick ? 'cursor-pointer' : ''}`, ref: ref, style: { flexGrow: flexWidth }, onClick: onClick },
        React.createElement("div", { className: "position-absolute chevronDiv top-50 start-50 translate-middle d-flex" }, workbench ? (workbench.index === ordino.focusViewIndex ? (React.createElement(FilterAndSelected, null)) : (React.createElement("p", { className: "chevronText flex-grow-1" }, workbench.index === ordino.focusViewIndex ? workbench.name : `${workbench.name.slice(0, 5)}..`))) : (React.createElement("i", { className: "flex-grow-1 fas fa-plus" }))),
        React.createElement("div", { className: "position-absolute chevronDiv top-50 translate-middle-y d-flex", style: { left: first ? '0px' : '4px' } }, workbench && workbench.index === ordino.focusViewIndex ? (React.createElement(React.Fragment, null,
            React.createElement(ShowDetailsSwitch, null),
            React.createElement("p", { className: "chevronText flex-grow-1" }, workbench.index === ordino.focusViewIndex ? workbench.name : `${workbench.name.slice(0, 5)}..`))) : null),
        React.createElement("div", { className: "position-absolute chevronDiv top-50 translate-middle-y d-flex", style: { right: '8px' } }, workbench && workbench.index === ordino.focusViewIndex ? (React.createElement(React.Fragment, null,
            React.createElement(AddViewButton, { color: "white" }))) : null),
        React.createElement(ChevronBreadcrumb, { color: color, width: width, first: first })));
}
//# sourceMappingURL=SingleBreadcrumb.js.map