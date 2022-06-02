import React, { useMemo, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { DetailsSidebar } from './DetailsSidebar';
export function WorkbenchUtilsSidebar({ workbench }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [openedTab, setOpenedTab] = useState(null);
    const openedTabComponent = useMemo(() => {
        switch (openedTab) {
            case 'add': {
                return React.createElement("div", null, "Adding something");
            }
            case 'mapping': {
                return React.createElement(DetailsSidebar, { workbench: workbench });
            }
            case 'filter': {
                return React.createElement("div", null, "Filter something");
            }
            case 'comment': {
                return React.createElement("div", null, "Comment something");
            }
            default: {
                return React.createElement("div", null, "Thats weird");
            }
        }
    }, [openedTab, workbench]);
    return (React.createElement("div", { className: "d-flex" },
        React.createElement("div", { className: "d-flex flex-column" },
            React.createElement("button", { className: "btn btn-icon-dark shadow-none", type: "button", onClick: () => setOpenedTab('add') },
                React.createElement("i", { className: "fas fa-plus-circle" })),
            React.createElement("button", { className: "btn btn-icon-dark shadow-none", type: "button", onClick: () => setOpenedTab('mapping') },
                React.createElement("i", { className: "fas fa-database" })),
            React.createElement("button", { className: "btn btn-icon-dark shadow-none", type: "button", onClick: () => setOpenedTab('filter') },
                React.createElement("i", { className: "fas fa-filter" })),
            React.createElement("button", { className: "btn btn-icon-dark shadow-none", type: "button", onClick: () => setOpenedTab('comment') },
                React.createElement("i", { className: "fas fa-comment" }))),
        openedTab !== null ? React.createElement("div", null, openedTabComponent) : null));
}
//# sourceMappingURL=WorkbenchUtilsSidebar.js.map