import * as React from 'react';
import { Corner, createRemoveUpdate, getNodeAtPath, getOtherDirection, getPathToCorner, Mosaic, updateTree, } from 'react-mosaic-component';
import { useCallback, useState } from 'react';
import { dropRight } from 'lodash';
import { useAppSelector } from '../../hooks/useAppSelector';
import { DetailsSidebar } from './sidebar/DetailsSidebar';
import { WorkbenchView } from './WorkbenchView';
import { useCommentPanel } from './useCommentPanel';
import { CreateNextWorkbenchSidebar } from './sidebar/CreateNextWorkbenchSidebar';
import { setCommentsOpen } from '../../store/ordinoSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
export var EWorkbenchType;
(function (EWorkbenchType) {
    EWorkbenchType["PREVIOUS"] = "t-previous";
    EWorkbenchType["FOCUS"] = "t-focus";
    EWorkbenchType["CONTEXT"] = "t-context";
    EWorkbenchType["NEXT"] = "t-next";
})(EWorkbenchType || (EWorkbenchType = {}));
export function WorkbenchViews({ index, type }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const { views, selection, commentsOpen, itemIDType } = ordino.workbenches[index];
    const onCommentPanelVisibilityChanged = React.useCallback((isOpen) => dispatch(setCommentsOpen({ workbenchIndex: index, isOpen })), [index, dispatch]);
    const [setRef] = useCommentPanel({ selection, itemIDType, commentsOpen, isFocused: type === EWorkbenchType.FOCUS, onCommentPanelVisibilityChanged });
    const [mosaicState, setMosaicState] = useState(views[0].uniqueId);
    const [mosaicViewCount, setMosaicViewCount] = useState(1);
    const [mosaicDrag, setMosaicDrag] = useState(false);
    const firstViewUniqueId = views[0].uniqueId;
    React.useEffect(() => {
        // reset mosaic to initial state when first view unique id changes
        // e.g., when opening a new workbench with the same idtype
        setMosaicState(firstViewUniqueId);
    }, [firstViewUniqueId]);
    React.useEffect(() => {
        // If a new view got added to the workbench, currently via the "Add View" button, we need to put the view into our mosaic state
        if (views.length > mosaicViewCount) {
            const path = getPathToCorner(mosaicState, Corner.TOP_RIGHT);
            const parent = getNodeAtPath(mosaicState, dropRight(path));
            const destination = getNodeAtPath(mosaicState, path);
            const direction = parent ? getOtherDirection(parent.direction) : 'row';
            const newViewId = views[views.length - 1].uniqueId; // assumes that the new view is appended to the array
            let first;
            let second;
            if (direction === 'row') {
                first = destination;
                second = newViewId;
            }
            else {
                first = newViewId;
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
    }, [mosaicState, mosaicViewCount, views]);
    const removeCallback = useCallback((path) => {
        const removeUpdate = createRemoveUpdate(mosaicState, path);
        const newNode = updateTree(mosaicState, [removeUpdate]);
        setMosaicState(newNode);
        setMosaicViewCount(views.length - 1);
    }, [mosaicState, views]);
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
                            return React.createElement(WorkbenchView, { removeCallback: removeCallback, mosaicDrag: mosaicDrag, workbenchIndex: index, path: path, view: currView });
                        }
                        return null;
                    }, onChange: onChangeCallback, onRelease: () => setMosaicDrag(false), value: ordino.focusWorkbenchIndex === index ? mosaicState : firstViewUniqueId })),
            showRightSidebar ? (React.createElement("div", { className: "d-flex", style: { width: '400px' } },
                React.createElement(CreateNextWorkbenchSidebar, { workbench: ordino.workbenches[index] }))) : null)));
}
//# sourceMappingURL=WorkbenchViews.js.map