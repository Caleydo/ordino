import * as React from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { useAppSelector } from '../../hooks/useAppSelector';
import { AddWorkbenchSidebar } from './sidebar/AddWorkbenchSidebar';
import { DetailsSidebar } from './sidebar/DetailsSidebar';
import { useCommentPanel } from './useCommentPanel';
import { WorkbenchSingleView } from './WorkbenchSingleView';
export var EWorkbenchType;
(function (EWorkbenchType) {
    EWorkbenchType["PREVIOUS"] = "t-previous";
    EWorkbenchType["FOCUS"] = "t-focus";
    EWorkbenchType["CONTEXT"] = "t-context";
    EWorkbenchType["NEXT"] = "t-next";
})(EWorkbenchType || (EWorkbenchType = {}));
export function WorkbenchViews({ index, type }) {
    const ordino = useAppSelector((state) => state.ordino);
    const { views, selection, commentsOpen, itemIDType } = ordino.workbenches[index];
    const [setRef] = useCommentPanel({ selection, itemIDType, commentsOpen, isFocused: type === EWorkbenchType.FOCUS });
    let wb = null;
    const ELEMENT_MAP = {
        0: React.createElement(WorkbenchSingleView, { key: `wbView${views[0].uniqueId}`, workbenchIndex: index, view: views[0] }),
        1: views.length > 1 ? React.createElement(WorkbenchSingleView, { key: `wbView${views[1].uniqueId}`, workbenchIndex: index, view: views[1] }) : null,
        2: views.length > 2 ? React.createElement(WorkbenchSingleView, { key: `wbView${views[2].uniqueId}`, workbenchIndex: index, view: views[2] }) : null,
        3: views.length > 3 ? React.createElement(WorkbenchSingleView, { key: `wbView${views[3].uniqueId}`, workbenchIndex: index, view: views[3] }) : null,
    };
    if (views.length === 1 || type !== EWorkbenchType.FOCUS) {
        wb = (React.createElement(Mosaic, { renderTile: (id, path) => (React.createElement(MosaicWindow, { path: path, createNode: () => 0, title: id.toString() }, ELEMENT_MAP[id])), initialValue: 0, blueprintNamespace: "bp4" }));
    }
    else if (views.length === 2) {
        wb = (React.createElement(Mosaic, { renderTile: (id, path) => (React.createElement(MosaicWindow, { path: path, createNode: () => 0, title: id.toString() }, ELEMENT_MAP[id])), initialValue: {
                direction: 'row',
                first: 0,
                second: 1,
                splitPercentage: 50,
            }, blueprintNamespace: "bp4" }));
    }
    else if (views.length === 3) {
        wb = (React.createElement(Mosaic, { renderTile: (id, path) => (React.createElement(MosaicWindow, { path: path, createNode: () => 0, title: id.toString() }, ELEMENT_MAP[id])), initialValue: {
                direction: 'row',
                first: 0,
                second: {
                    direction: 'column',
                    first: 1,
                    second: 2,
                },
                splitPercentage: 50,
            }, blueprintNamespace: "bp4" }));
    }
    else if (views.length === 4) {
        wb = (React.createElement(Mosaic, { renderTile: (id, path) => (React.createElement(MosaicWindow, { path: path, createNode: () => 0, title: id.toString() }, ELEMENT_MAP[id])), initialValue: {
                direction: 'row',
                first: {
                    direction: 'column',
                    first: 0,
                    second: 3,
                },
                second: {
                    direction: 'column',
                    first: 1,
                    second: 2,
                },
                splitPercentage: 50,
            }, blueprintNamespace: "bp4" }));
    }
    // TODO:: Figure out better way to not force a remount of the individual views because of reparenting here. Currently the empty split panes are doing that.
    // if (views.length === 1 || type !== EWorkbenchType.FOCUS) {
    //   wb = (
    //     <SplitPane
    //       split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'}
    //       primary="second"
    //       className=""
    //       minSize={300}
    //       size="0%"
    //     >
    //       <SplitPane
    //         split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
    //         primary="second"
    //         className=""
    //         minSize={300}
    //         size="0%"
    //       >
    //         <WorkbenchSingleView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]} />
    //       </SplitPane>
    //       <SplitPane
    //         split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
    //         primary="second"
    //         className=""
    //         minSize={300}
    //         size="0%"
    //       />
    //     </SplitPane>
    //   );
    // } else if (views.length === 2) {
    //   wb = (
    //     <SplitPane
    //       split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'}
    //       primary="second"
    //       className=""
    //       minSize={300}
    //       size="50%"
    //     >
    //       <SplitPane
    //         split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
    //         primary="second"
    //         className=""
    //         minSize={300}
    //         size="0%"
    //       >
    //         <WorkbenchSingleView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]} />
    //       </SplitPane>
    //       <SplitPane
    //         split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
    //         primary="second"
    //         className=""
    //         minSize={300}
    //         size="0%"
    //       >
    //         <WorkbenchSingleView key={`wbView${views[1].uniqueId}`} workbenchIndex={index} view={views[1]} />
    //       </SplitPane>
    //     </SplitPane>
    //   );
    // } else if (views.length === 3) {
    //   wb = (
    //     <SplitPane
    //       split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'}
    //       primary="second"
    //       className=""
    //       minSize={300}
    //       size="50%"
    //     >
    //       <SplitPane
    //         split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
    //         primary="second"
    //         className=""
    //         minSize={300}
    //         size="0%"
    //       >
    //         <WorkbenchSingleView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]} />
    //       </SplitPane>
    //       <SplitPane
    //         split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
    //         primary="second"
    //         className=""
    //         minSize={300}
    //         size="50%"
    //       >
    //         <WorkbenchSingleView key={`wbView${views[1].uniqueId}`} workbenchIndex={index} view={views[1]} />
    //         <WorkbenchSingleView key={`wbView${views[2].uniqueId}`} workbenchIndex={index} view={views[2]} />
    //       </SplitPane>
    //     </SplitPane>
    //   );
    // } else {
    //   wb = (
    //     <SplitPane
    //       split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'}
    //       primary="second"
    //       className=""
    //       minSize={300}
    //       size="50%"
    //     >
    //       <SplitPane
    //         split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
    //         primary="second"
    //         className=""
    //         minSize={300}
    //         size="50%"
    //       >
    //         <WorkbenchSingleView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]} />
    //         <WorkbenchSingleView key={`wbView${views[3].uniqueId}`} workbenchIndex={index} view={views[3]} />
    //       </SplitPane>
    //       <SplitPane
    //         split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'}
    //         primary="second"
    //         className=""
    //         minSize={300}
    //         size="50%"
    //       >
    //         <WorkbenchSingleView key={`wbView${views[1].uniqueId}`} workbenchIndex={index} view={views[1]} />
    //         <WorkbenchSingleView key={`wbView${views[2].uniqueId}`} workbenchIndex={index} view={views[2]} />
    //       </SplitPane>
    //     </SplitPane>
    //   );
    // }
    const showLeftSidebar = ordino.workbenches[index].detailsOpen && index > 0 && type === EWorkbenchType.FOCUS;
    const showRightSidebar = ordino.workbenches[index].addWorkbenchOpen && type === EWorkbenchType.FOCUS;
    return (React.createElement("div", { className: "position-relative workbenchWrapper d-flex flex-grow-1" },
        React.createElement("div", { className: "d-flex flex-col w-100" },
            showLeftSidebar ? (React.createElement("div", { className: "d-flex", style: { width: '400px' } },
                React.createElement(DetailsSidebar, { workbench: ordino.workbenches[index] }))) : null,
            React.createElement("div", { ref: setRef, className: "h-100 w-100 m-0" }, wb),
            showRightSidebar ? (React.createElement("div", { className: "d-flex", style: { width: '400px' } },
                React.createElement(AddWorkbenchSidebar, { workbench: ordino.workbenches[index] }))) : null)));
}
//# sourceMappingURL=WorkbenchViews.js.map