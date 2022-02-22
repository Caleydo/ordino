import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../..';
import { ChevronBreadcrumb } from './ChevronBreadcrumb';
export function CollapsedBreadcrumb({ flexWidth = 1, color = 'cornflowerblue', workbenches = null }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [width, setWidth] = useState();
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            setWidth(ref.current.offsetWidth);
        }
    });
    return (React.createElement("div", { className: "position-relative", ref: ref, style: { flexGrow: flexWidth } },
        React.createElement("div", { className: "position-absolute chevronDiv top-50 start-50 translate-middle d-flex" },
            React.createElement("i", { className: "flex-grow-1 fas fa-ellipsis-v" })),
        React.createElement(ChevronBreadcrumb, { color: color, width: width, first: false })));
}
//# sourceMappingURL=CollapsedBreadcrumb.js.map