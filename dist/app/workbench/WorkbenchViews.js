import * as React from 'react';
import { useMemo } from 'react';
import SplitPane from 'react-split-pane';
import { useAppDispatch, useAppSelector } from '../..';
import { WorkbenchSingleView } from './WorkbenchSingleView';
export function WorkbenchViews({ index, onlyRanking = false, }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const views = ordino.workbenches[index].views;
    const children = useMemo(() => {
        return views.map((v) => React.createElement(WorkbenchSingleView, { workbenchIndex: index, key: v.id, view: v }));
    }, [views]);
    let wb = null;
    if (views.length === 1) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '0%' },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '0%' },
                React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views[0] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '0%' })));
    }
    else if (views.length === 2) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '50%' },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '0%' },
                React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views[0] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '0%' },
                React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views[1] }))));
    }
    else if (views.length === 3) {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '50%' },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '0%' },
                React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views[0] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '50%' },
                React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views[1] }),
                React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views[2] }))));
    }
    else {
        wb = (React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal', primary: "second", className: "", minSize: 300, size: '50%' },
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '50%' },
                React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views[0] }),
                React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views[3] })),
            React.createElement(SplitPane, { split: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical', primary: "second", className: "", minSize: 300, size: '50%' },
                React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views[1] }),
                React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views[2] }))));
    }
    return (React.createElement("div", { className: "position-relative workbenchWrapper d-flex flex-grow-1" }, onlyRanking ? React.createElement(WorkbenchSingleView, { workbenchIndex: index, view: views.find((v) => v.viewType === 'Ranking') }) : wb));
}
//# sourceMappingURL=WorkbenchViews.js.map