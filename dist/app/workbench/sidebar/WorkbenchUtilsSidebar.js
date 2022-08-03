import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { DetailsSidebar } from './DetailsSidebar';
import { trrack, useTrrackSelector } from '../../../store';
import { SidebarButton } from './SidebarButton';
import { isFirstWorkbench, isFocusWorkbench } from '../../../store/storeUtils';
import { ProvVis } from './trrackVis/src/components/ProvVis';
export function WorkbenchUtilsSidebar({ workbench, openTab = '' }) {
    const { midTransition, colorMap } = useAppSelector((state) => state.ordinoTracked);
    const focusIndex = useAppSelector((state) => state.ordinoTracked.focusWorkbenchIndex);
    const [openedTab, setOpenedTab] = useState(openTab);
    const currentTrrackNode = useTrrackSelector((s) => s.current);
    const openedTabComponent = useMemo(() => {
        switch (openedTab) {
            case 'add': {
                return React.createElement("div", { style: { width: '250px' } }, "Adding something");
            }
            case 'mapping': {
                return React.createElement(DetailsSidebar, { workbench: workbench });
            }
            case 'filter': {
                return (React.createElement("div", { className: "ps-2", style: { width: '250px' } },
                    React.createElement(ProvVis, { root: trrack.root.id, config: { changeCurrent: (node) => trrack.to(node), verticalSpace: 25, marginTop: 25, gutter: 25 }, nodeMap: trrack.graph.backend.nodes, currentNode: currentTrrackNode })));
            }
            case 'comment': {
                return React.createElement("div", { style: { width: '250px' } }, "Comment something");
            }
            default: {
                return React.createElement("div", { style: { width: '250px' } }, "There was an error finding the correct tab");
            }
        }
    }, [openedTab, workbench, currentTrrackNode]);
    useEffect(() => {
        if (midTransition === true && isFocusWorkbench(workbench)) {
            setOpenedTab(null);
        }
    }, [midTransition, workbench, focusIndex]);
    return (React.createElement("div", { className: "d-flex h-100", style: { borderRight: !openedTab ? '' : '1px solid lightgray' } },
        React.createElement("div", { className: "d-flex flex-column me-1", style: { borderRight: '1px solid lightgray' } },
            React.createElement(SidebarButton, { isSelected: openedTab === 'add', color: colorMap[workbench.entityId], icon: "fas fa-plus-circle", onClick: () => (openedTab === 'add' ? setOpenedTab(null) : setOpenedTab('add')) }),
            !isFirstWorkbench(workbench) ? (React.createElement(SidebarButton, { isSelected: openedTab === 'mapping', color: colorMap[workbench.entityId], icon: "fas fa-database", onClick: () => (openedTab === 'mapping' ? setOpenedTab(null) : setOpenedTab('mapping')) })) : null,
            React.createElement(SidebarButton, { isSelected: openedTab === 'filter', color: colorMap[workbench.entityId], icon: "fas fa-filter", onClick: () => (openedTab === 'filter' ? setOpenedTab(null) : setOpenedTab('filter')) }),
            React.createElement(SidebarButton, { isSelected: openedTab === 'comment', color: colorMap[workbench.entityId], icon: "fas fa-comment", onClick: () => (openedTab === 'comment' ? setOpenedTab(null) : setOpenedTab('comment')) })),
        openedTab !== null ? React.createElement("div", null, openedTabComponent) : null));
}
//# sourceMappingURL=WorkbenchUtilsSidebar.js.map