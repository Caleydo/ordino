import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../..';
import { ChevronBreadcrumb } from './ChevronBreadcrumb';
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
        React.createElement("div", { className: 'position-absolute top-50 start-50 translate-middle chevronText d-flex align-items-center justify-content-center' },
            React.createElement("p", { className: 'flex-grow-1' }, "Hello")),
        React.createElement(ChevronBreadcrumb, { color: color, width: width, first: first })));
}
//# sourceMappingURL=SingleChevron.js.map