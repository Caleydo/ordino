import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../..';
import { ChevronButtons } from './ChevronButtons';
import { ChevronBreadcrumb } from './ChevronBreadcrumb';
import { ShowDetailsSwitch } from './ShowDetailsSwitch';
export function SingleBreadcrumb({ first = false, flexWidth = 1, onClick = null, color = 'cornflowerblue', workbench = null, }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [width, setWidth] = useState();
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.offsetWidth);
        }
    });
    return (React.createElement("div", { className: 'position-relative', ref: ref, style: { flexGrow: flexWidth }, onClick: onClick },
        React.createElement("div", { className: 'position-absolute chevronDiv top-50 start-50 translate-middle d-flex' }, workbench
            ?
                React.createElement("p", { className: 'chevronText flex-grow-1' }, workbench.index === ordino.focusViewIndex ? workbench.name : workbench.name.slice(0, 5) + '..')
            :
                React.createElement("i", { className: "flex-grow-1 fas fa-plus" })),
        React.createElement("div", { className: 'position-absolute chevronDiv top-50 translate-middle-y d-flex', style: { left: first ? '8px' : '16px' } }, workbench && workbench.index === ordino.focusViewIndex ?
            React.createElement(React.Fragment, null,
                React.createElement(ShowDetailsSwitch, null),
                React.createElement(ChevronButtons, { color: color }))
            : null),
        React.createElement(ChevronBreadcrumb, { color: color, width: width, first: first })));
}
//# sourceMappingURL=SingleBreadcrumb.js.map