import * as React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { Filmstrip } from './Filmstrip';
import { useAppSelector } from '../hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
export function Ordino() {
    const ordino = useAppSelector((state) => state.ordino);
    return (React.createElement("div", { id: "content" },
        React.createElement("main", { "data-anchor": "main", className: "targid" },
            React.createElement(DndProvider, { backend: HTML5Backend },
                React.createElement(Breadcrumb, null),
                React.createElement(Filmstrip, null)))));
}
//# sourceMappingURL=Ordino.js.map