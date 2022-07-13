import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { DetailsSidebar } from './DetailsSidebar';
import { SidebarButton } from './SidebarButton';
export function WorkbenchUtilsSidebar({ workbench, openTab = '' }) {
    const ordino = useAppSelector((state) => state.ordino);
    const [openedTab, setOpenedTab] = useState(openTab);
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
                return React.createElement("div", { style: { width: '250px' } }, "There was an error finding the correct tab");
            }
        }
    }, [openedTab, workbench]);
    useEffect(() => {
        if (ordino.midTransition === true && workbench.index === ordino.focusWorkbenchIndex) {
            setOpenedTab(null);
        }
    }, [ordino.midTransition, workbench.index, ordino.focusWorkbenchIndex]);
    return (React.createElement("div", { className: "d-flex h-100", style: { borderRight: !openedTab ? '' : '1px solid lightgray' } },
        React.createElement("div", { className: "d-flex flex-column me-1", style: { borderRight: '1px solid lightgray' } },
            React.createElement(SidebarButton, { isSelected: openedTab === 'add', color: ordino.colorMap[workbench.entityId], icon: "fas fa-plus-circle", onClick: () => (openedTab === 'add' ? setOpenedTab(null) : setOpenedTab('add')) }),
            workbench.index > 0 ? (React.createElement(SidebarButton, { isSelected: openedTab === 'mapping', color: ordino.colorMap[workbench.entityId], icon: "fas fa-database", onClick: () => (openedTab === 'mapping' ? setOpenedTab(null) : setOpenedTab('mapping')) })) : null,
            React.createElement(SidebarButton, { isSelected: openedTab === 'filter', color: ordino.colorMap[workbench.entityId], icon: "fas fa-filter", onClick: () => (openedTab === 'filter' ? setOpenedTab(null) : setOpenedTab('filter')) }),
            React.createElement(SidebarButton, { isSelected: openedTab === 'comment', color: ordino.colorMap[workbench.entityId], icon: "fas fa-comment", onClick: () => (openedTab === 'comment' ? setOpenedTab(null) : setOpenedTab('comment')) })),
        openedTab !== null ? React.createElement("div", null, openedTabComponent) : null));
}
//# sourceMappingURL=WorkbenchUtilsSidebar.js.map