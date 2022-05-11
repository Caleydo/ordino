import * as React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setDetailsSidebarOpen } from '../../store';
export function ShowDetailsSwitch({ height = 30 }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    return (React.createElement("div", null,
        React.createElement("button", { type: "button", onClick: () => dispatch(setDetailsSidebarOpen({ workbenchIndex: ordino.focusWorkbenchIndex, open: !ordino.workbenches[ordino.focusWorkbenchIndex].detailsSidebarOpen })), className: "btn btn-icon-light align-middle" },
            React.createElement("i", { className: "flex-grow-1 fas fa-bars m-1" }))));
}
//# sourceMappingURL=ShowDetailsSwitch.js.map