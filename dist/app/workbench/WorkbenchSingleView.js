import * as React from 'react';
import { useDrop } from 'react-dnd';
import { Lineup } from '../lite';
import { DropOverlay } from './DropOverlay';
import { MoveButton } from './MoveButton';
import { EDragTypes } from './utils';
export function WorkbenchSingleView({ view }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: [EDragTypes.ADD, EDragTypes.MOVE],
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), []);
    return (React.createElement("div", { ref: drop, className: "position-relative shadow bg-body workbenchView rounded" },
        React.createElement(MoveButton, { view: view }),
        React.createElement(Lineup, null),
        isOver ? React.createElement(DropOverlay, { view: view }) : null));
}
//# sourceMappingURL=WorkbenchSingleView.js.map