import * as React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { Filmstrip } from './Filmstrip';
import { StartMenuTabWrapper } from '../components/header/menu/StartMenuTabWrapper';
import { useAppSelector } from '../hooks';
export function Ordino() {
    const ordino = useAppSelector((state) => state.ordino);
    return (React.createElement("div", { id: "content" },
        React.createElement("main", { "data-anchor": "main", className: "targid" },
            React.createElement(StartMenuTabWrapper, null),
            React.createElement(Breadcrumb, null),
            React.createElement(Filmstrip, null))));
}
//# sourceMappingURL=Ordino.js.map