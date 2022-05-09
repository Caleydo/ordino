import * as React from 'react';
import { Corner, createRemoveUpdate, getNodeAtPath, getOtherDirection, getPathToCorner, Mosaic, updateTree, } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { useCallback, useState } from 'react';
import { dropRight } from 'lodash';
import { useAppSelector } from '../../hooks/useAppSelector';
import { DetailsSidebar } from './sidebar/DetailsSidebar';
import { WorkbenchView } from './WorkbenchView';
import { useCommentPanel } from './useCommentPanel';
import { CreateNextWorkbenchSidebar } from './sidebar/CreateNextWorkbenchSidebar';
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
    const [mosaicState, setMosaicState] = useState(null);
    const [mosaicViewCount, setMosaicViewCount] = useState(1);
    const [mosaicDrag, setMosaicDrag] = useState(false);
    React.useEffect(() => {
        if (mosaicState === null) {
            setMosaicState(views[0].uniqueId);
            return;
        }
        if (views.length > mosaicViewCount) {
            const path = getPathToCorner(mosaicState, Corner.TOP_RIGHT);
            const parent = getNodeAtPath(mosaicState, dropRight(path));
            const destination = getNodeAtPath(mosaicState, path);
            const direction = parent ? getOtherDirection(parent.direction) : 'row';
            let first;
            let second;
            if (direction === 'row') {
                first = destination;
                second = views[views.length - 1].uniqueId;
            }
            else {
                first = views[views.length - 1].uniqueId;
                second = destination;
            }
            const newNode = updateTree(mosaicState, [
                {
                    path,
                    spec: {
                        $set: {
                            direction,
                            first,
                            second,
                        },
                    },
                },
            ]);
            setMosaicState(newNode);
            setMosaicViewCount(views.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [views.length]);
    const removeCallback = useCallback((path) => {
        const removeUpdate = createRemoveUpdate(mosaicState, path);
        const newNode = updateTree(mosaicState, [removeUpdate]);
        setMosaicState(newNode);
        setMosaicViewCount(views.length - 1);
    }, [mosaicState, views.length]);
    const onChangeCallback = useCallback((rootNode) => {
        setMosaicState(rootNode);
        setMosaicDrag(true);
    }, []);
    const showLeftSidebar = ordino.workbenches[index].detailsSidebarOpen && index > 0 && type === EWorkbenchType.FOCUS;
    const showRightSidebar = ordino.workbenches[index].createNextWorkbenchSidebarOpen && type === EWorkbenchType.FOCUS;
    return (React.createElement("div", { className: "position-relative workbenchWrapper d-flex flex-grow-1" },
        React.createElement("div", { className: "d-flex flex-col w-100" },
            showLeftSidebar ? (React.createElement("div", { className: "d-flex", style: { width: '400px' } },
                React.createElement(DetailsSidebar, { workbench: ordino.workbenches[index] }))) : null,
            React.createElement("div", { ref: setRef, className: "d-flex flex-grow-1" },
                React.createElement(Mosaic, { renderTile: (id, path) => {
                        const currView = views.find((v) => v.uniqueId === id);
                        if (currView) {
                            return React.createElement(WorkbenchView, { removeCallback: removeCallback, dragMode: mosaicDrag, workbenchIndex: index, path: path, view: currView });
                        }
                        return null;
                    }, onChange: onChangeCallback, onRelease: () => setMosaicDrag(false), value: ordino.focusWorkbenchIndex === index ? mosaicState : views[0].uniqueId })),
            showRightSidebar ? (React.createElement("div", { className: "d-flex", style: { width: '400px' } },
                React.createElement(CreateNextWorkbenchSidebar, { workbench: ordino.workbenches[index] }))) : null)));
}
//# sourceMappingURL=WorkbenchViews.js.map