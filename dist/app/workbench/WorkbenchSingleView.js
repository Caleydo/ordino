import * as React from 'react';
import { useDrop } from 'react-dnd';
import { DropOverlay } from './DropOverlay';
import { MoveButton } from './MoveButton';
import { EDragTypes } from './utils';
export function WorkbenchSingleView({ view }) {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: [EDragTypes.MOVE],
        canDrop: (d) => {
            return d.viewId !== view.id;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [view.id]);
    return (React.createElement("div", { ref: drop, className: "position-relative shadow bg-body workbenchView rounded" },
        React.createElement(MoveButton, { view: view }),
        React.createElement("div", { style: { flex: '1 1 auto', justifyContent: 'center', display: 'flex', alignItems: 'center' } },
            React.createElement("span", { style: { fontSize: 30 } }, view.id)),
        isOver && canDrop ? React.createElement(DropOverlay, { view: view }) : null));
}
//# sourceMappingURL=WorkbenchSingleView.js.map