import * as React from 'react';
import SplitPane from 'react-split-pane';
import { useAppSelector } from '../..';
import { WorkbenchSingleView } from './WorkbenchSingleView';
export function WorkbenchViews({ index, onlyRanking = false, }) {
    const ordino = useAppSelector((state) => state.ordino);
    const views = ordino.workbenches[index].views;
    let wb = null;
    //TODO:: Figure out better way to not force a remount of the individual views because of reparenting here. Currently the empty split panes are doing that.
    if (views.length === 1 || onlyRanking) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '0%' },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '0%' },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[0].uniqueId}`, workbenchIndex: index, view: views[0] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '0%' })));
    }
    else if (views.length === 2) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '50%' },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '0%' },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[0].uniqueId}`, workbenchIndex: index, view: views[0] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '0%' },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[1].uniqueId}`, workbenchIndex: index, view: views[1] }))));
    }
    else if (views.length === 3) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '50%' },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '0%' },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[0].uniqueId}`, workbenchIndex: index, view: views[0] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '50%' },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[1].uniqueId}`, workbenchIndex: index, view: views[1] }),
                React.createElement(WorkbenchSingleView, { key: `wbView${views[2].uniqueId}`, workbenchIndex: index, view: views[2] }))));
    }
    else {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '50%' },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '50%' },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[0].uniqueId}`, workbenchIndex: index, view: views[0] }),
                React.createElement(WorkbenchSingleView, { key: `wbView${views[3].uniqueId}`, workbenchIndex: index, view: views[3] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '50%' },
                React.createElement(WorkbenchSingleView, { key: `wbView${views[1].uniqueId}`, workbenchIndex: index, view: views[1] }),
                React.createElement(WorkbenchSingleView, { key: `wbView${views[2].uniqueId}`, workbenchIndex: index, view: views[2] }))));
    }
    return (React.createElement("div", { className: "position-relative workbenchWrapper d-flex flex-grow-1" }, wb));
}
//# sourceMappingURL=WorkbenchViews.js.map