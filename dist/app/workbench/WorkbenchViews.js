import * as React from 'react';
import SplitPane from 'react-split-pane';
import { useAppSelector } from '../../hooks/useAppSelector';
import { EWorkbenchType } from '../Workbench';
import { AddWorkbenchSidebar } from './sidebar/AddWorkbenchSidebar';
import { DetailsSidebar } from './sidebar/DetailsSidebar';
import { WorkbenchSingleView } from './WorkbenchSingleView';
export function WorkbenchViews({ index, type }) {
    const ordino = useAppSelector((state) => state.ordino);
    const { views } = ordino.workbenches[index];
    let wb = null;
    // TODO:: Figure out better way to not force a remount of the individual views because of reparenting here. Currently the empty split panes are doing that.
    if (views.length === 1 || type !== EWorkbenchType.FOCUS) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: "0%" },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: "0%" },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[0].uniqueId}`, workbenchIndex: index, view: views[0] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: "0%" })));
    }
    else if (views.length === 2) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: "50%" },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: "0%" },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[0].uniqueId}`, workbenchIndex: index, view: views[0] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: "0%" },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[1].uniqueId}`, workbenchIndex: index, view: views[1] }))));
    }
    else if (views.length === 3) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: "50%" },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: "0%" },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[0].uniqueId}`, workbenchIndex: index, view: views[0] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: "50%" },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[1].uniqueId}`, workbenchIndex: index, view: views[1] }),
                React.createElement(WorkbenchSingleView, { key: `wbView${views[2].uniqueId}`, workbenchIndex: index, view: views[2] }))));
    }
    else {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: "50%" },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: "50%" },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[0].uniqueId}`, workbenchIndex: index, view: views[0] }),
                React.createElement(WorkbenchSingleView, { key: `wbView${views[3].uniqueId}`, workbenchIndex: index, view: views[3] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: "50%" },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[1].uniqueId}`, workbenchIndex: index, view: views[1] }),
                React.createElement(WorkbenchSingleView, { key: `wbView${views[2].uniqueId}`, workbenchIndex: index, view: views[2] }))));
    }
    const showLeftSidebar = ordino.workbenches[index].detailsOpen && index > 0 && type === EWorkbenchType.FOCUS;
    const showRightSidebar = ordino.workbenches[index].addWorkbenchOpen && type === EWorkbenchType.FOCUS;
    return (React.createElement("div", { className: "position-relative workbenchWrapper d-flex flex-grow-1" },
        React.createElement("div", { className: "d-flex flex-col w-100" },
            showLeftSidebar ? (React.createElement("div", { className: "d-flex", style: { width: '400px' } },
                React.createElement(DetailsSidebar, { workbench: ordino.workbenches[index] }))) : null,
            React.createElement("div", { style: { flexGrow: 10 } }, wb),
            showRightSidebar ? (React.createElement("div", { className: "d-flex", style: { width: '400px' } },
                React.createElement(AddWorkbenchSidebar, { workbench: ordino.workbenches[index] }))) : null)));
}
//# sourceMappingURL=WorkbenchViews.js.map