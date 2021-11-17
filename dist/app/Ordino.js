import * as React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { Filmstrip } from './Filmstrip';
import { useSelector } from 'react-redux';
export function Ordino() {
    const ordino = useSelector((state) => state.ordino);
    return (React.createElement("div", { id: "content" },
        React.createElement("main", { "data-anchor": "main", className: "targid" },
            React.createElement(Breadcrumb, null),
            React.createElement(Filmstrip, null))));
}
//# sourceMappingURL=Ordino.js.map