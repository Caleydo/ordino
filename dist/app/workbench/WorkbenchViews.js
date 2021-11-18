import * as React from 'react';
import SplitPane from 'react-split-pane';
import { useAppDispatch, useAppSelector } from '../..';
import { WorkbenchSingleView } from './WorkbenchSingleView';
export function WorkbenchViews({ index }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const views = ordino.workbenches[index].views;
    console.log(views);
    let wb = null;
    if (views.length === 1) {
        wb = (React.createElement(WorkbenchSingleView, { view: views[0] }));
    }
    else if (views.length === 2) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '50%' },
            React.createElement(WorkbenchSingleView, { view: views[0] }),
            React.createElement(WorkbenchSingleView, { view: views[1] })));
    }
    else if (views.length === 3) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '50%' },
            React.createElement(WorkbenchSingleView, { view: views[0] }),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '50%' },
                React.createElement(WorkbenchSingleView, { view: views[1] }),
                React.createElement(WorkbenchSingleView, { view: views[2] }))));
    }
    else {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '50%' },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '50%' },
                React.createElement(WorkbenchSingleView, { view: views[0] }),
                React.createElement(WorkbenchSingleView, { view: views[3] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '50%' },
                React.createElement(WorkbenchSingleView, { view: views[1] }),
                React.createElement(WorkbenchSingleView, { view: views[2] }))));
    }
    return (React.createElement("div", { className: "position-relative workbenchWrapper d-flex flex-grow-1" }, wb));
}
//# sourceMappingURL=WorkbenchViews.js.map