import * as React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { Filmstrip } from './Filmstrip';
export function Ordino() {
    return (React.createElement("div", { id: "content" },
        React.createElement("main", { "data-anchor": "main", className: "targid" },
            React.createElement(Breadcrumb, null),
            React.createElement(Filmstrip, null))));
}
//# sourceMappingURL=Ordino.js.map