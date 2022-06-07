import React, { useMemo, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { DetailsSidebar } from './DetailsSidebar';
export function WorkbenchUtilsSidebar({ workbench }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [openedTab, setOpenedTab] = useState(workbench.index > 0 ? 'mapping' : null);
    const openedTabComponent = useMemo(() => {
        switch (openedTab) {
            case 'add': {
                return React.createElement("div", { style: { width: '250px' } }, "Adding something");
            }
            case 'mapping': {
                return React.createElement(DetailsSidebar, { workbench: workbench });
            }
            case 'filter': {
                return React.createElement("div", { style: { width: '250px' } }, "Filter something");
            }
            case 'comment': {
                return React.createElement("div", { style: { width: '250px' } }, "Comment something");
            }
            default: {
                return React.createElement("div", { style: { width: '250px' } }, "Thats weird");
            }
        }
    }, [openedTab, workbench]);
    return (React.createElement("div", { className: "d-flex p-1", style: { borderRight: '1px solid lightgray' } },
        React.createElement("div", { className: "d-flex flex-column" },
            React.createElement("button", { className: `btn shadow-none ${openedTab === 'add' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`, type: "button", onClick: () => (openedTab === 'add' ? setOpenedTab(null) : setOpenedTab('add')) },
                React.createElement("i", { className: "fas fa-plus-circle" })),
            workbench.index > 0 ? (React.createElement("button", { className: `btn shadow-none ${openedTab === 'mapping' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`, type: "button", onClick: () => (openedTab === 'mapping' ? setOpenedTab(null) : setOpenedTab('mapping')) },
                React.createElement("i", { className: "fas fa-database" }))) : null,
            React.createElement("button", { className: `btn shadow-none ${openedTab === 'filter' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`, type: "button", onClick: () => (openedTab === 'filter' ? setOpenedTab(null) : setOpenedTab('filter')) },
                React.createElement("i", { className: "fas fa-filter" })),
            React.createElement("button", { className: `btn shadow-none ${openedTab === 'comment' ? 'bg-primary btn-icon-light' : 'btn-icon-dark'}`, type: "button", onClick: () => (openedTab === 'comment' ? setOpenedTab(null) : setOpenedTab('comment')) },
                React.createElement("i", { className: "fas fa-comment" }))),
        openedTab !== null ? React.createElement("div", null, openedTabComponent) : null));
}
//# sourceMappingURL=WorkbenchUtilsSidebar.js.map