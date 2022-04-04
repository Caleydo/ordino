import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { I18nextManager } from 'tdp_core';
import { AddViewButton } from './AddViewButton';
import { ChevronBreadcrumb } from './ChevronBreadcrumb';
import { ShowDetailsSwitch } from './ShowDetailsSwitch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FilterAndSelected } from './FilterAndSelected';
export function SingleBreadcrumb({ first = false, flexWidth = 1, onClick = null, color = 'cornflowerblue', workbench = null }) {
    const ordino = useAppSelector((state) => state.ordino);
    const [width, setWidth] = useState();
    const ref = useRef(null);
    useEffect(() => {
        const ro = new ResizeObserver((entries) => {
            entries.forEach((e) => {
                setWidth(e.contentRect.width);
            });
        });
        ro.observe(ref.current);
    }, []);
    return (React.createElement("div", { className: `position-relative ${onClick ? 'cursor-pointer' : ''}`, ref: ref, style: { flexGrow: flexWidth }, onClick: onClick },
        React.createElement("div", { className: "position-absolute chevronDiv top-50 start-50 translate-middle d-flex" }, workbench ? (workbench.index === ordino.focusViewIndex ? (React.createElement(FilterAndSelected, null)) : (React.createElement("p", { className: "chevronText flex-grow-1" }, workbench.name.slice(0, 5)))) : (React.createElement("i", { className: "flex-grow-1 fas fa-plus" }))),
        React.createElement("div", { className: "position-absolute chevronDiv top-50 translate-middle-y d-flex", style: { left: first ? (workbench.index > 0 ? '0px' : '20px') : '4px' } }, workbench && workbench.index === ordino.focusViewIndex ? (React.createElement(React.Fragment, null,
            workbench.index > 0 ? React.createElement(ShowDetailsSwitch, null) : null,
            React.createElement("p", { className: "chevronText flex-grow-1" }, I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.workbenchName', { workbenchName: workbench.name })))) : null),
        React.createElement("div", { className: "position-absolute chevronDiv top-50 translate-middle-y d-flex", style: { right: '8px' } }, workbench && workbench.index === ordino.focusViewIndex ? (React.createElement(React.Fragment, null,
            React.createElement(AddViewButton, { color: "white" }))) : null),
        React.createElement(ChevronBreadcrumb, { color: color, width: width, first: first })));
}
//# sourceMappingURL=SingleBreadcrumb.js.map