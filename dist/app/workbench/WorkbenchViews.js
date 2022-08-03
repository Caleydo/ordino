import * as React from 'react';
import { Corner, createRemoveUpdate, getNodeAtPath, getOtherDirection, getPathToCorner, Mosaic, updateTree, } from 'react-mosaic-component';
import { useCallback, useState } from 'react';
import { dropRight } from 'lodash';
import { useAppSelector } from '../../hooks/useAppSelector';
import { WorkbenchView } from './WorkbenchView';
import { useAppDispatch } from '../../hooks/useAppDispatch';
export var EWorkbenchType;
(function (EWorkbenchType) {
    EWorkbenchType["PREVIOUS"] = "t-previous";
    EWorkbenchType["FOCUS"] = "t-focus";
    EWorkbenchType["CONTEXT"] = "t-context";
    EWorkbenchType["NEXT"] = "t-next";
})(EWorkbenchType || (EWorkbenchType = {}));
export function WorkbenchViews({ index, type }) {
    const workbench = useAppSelector((state) => state.ordinoTracked.workbenches[index]);
    const focusIndex = useAppSelector((state) => state.ordinoTracked.focusWorkbenchIndex);
    const midTransition = useAppSelector((state) => state.ordinoTracked.midTransition);
    const dispatch = useAppDispatch();
    const { views, selection, commentsOpen, itemIDType } = workbench;
    // const onCommentPanelVisibilityChanged = React.useCallback(
    //   (isOpen: boolean) => dispatch(setCommentsOpen({ workbenchIndex: index, isOpen })),
    //   [index, dispatch],
    // );
    // const [setRef] = useCommentPanel({ selection, itemIDType, commentsOpen, isFocused: type === EWorkbenchType.FOCUS, onCommentPanelVisibilityChanged });
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
            const path = getPathToCorner(mosaicState, midTransition ? Corner.BOTTOM_RIGHT : Corner.TOP_RIGHT);
            const parent = getNodeAtPath(mosaicState, dropRight(path));
            const destination = getNodeAtPath(mosaicState, path);
            const direction = parent && parent.direction ? getOtherDirection(parent.direction) : midTransition ? 'column' : 'row';
            const newViewId = views[views.length - 1].uniqueId; // assumes that the new view is appended to the array
            let first;
            let second;
            if (direction === 'row') {
                first = destination;
                second = newViewId;
            }
            else {
                first = midTransition ? destination : newViewId;
                second = midTransition ? newViewId : destination;
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
    }, [mosaicState, mosaicViewCount, views, midTransition]);
    const removeCallback = useCallback((path) => {
        const removeUpdate = createRemoveUpdate(mosaicState, path);
        const newNode = updateTree(mosaicState, [removeUpdate]);
        setMosaicState(newNode);
        setMosaicViewCount(views.length - 1);
    }, [mosaicState, views]);
    const onChangeCallback = useCallback((rootNode) => {
        setMosaicState(rootNode);
        if (!mosaicDrag) {
            setMosaicDrag(true);
        }
    }, [mosaicDrag]);
    return (React.createElement("div", { className: "position-relative d-flex flex-grow-1" },
        React.createElement("div", { className: "d-flex flex-col w-100" },
            React.createElement("div", { className: "d-flex flex-grow-1" },
                React.createElement(Mosaic, { renderTile: (id, path) => {
                        const currView = views.find((v) => v.uniqueId === id);
                        if (currView) {
                            return React.createElement(WorkbenchView, { removeCallback: removeCallback, mosaicDrag: mosaicDrag, workbenchIndex: index, path: path, view: currView });
                        }
                        return null;
                    }, onChange: onChangeCallback, onRelease: () => setMosaicDrag(false), value: focusIndex === index ? mosaicState : firstViewUniqueId })))));
}
//# sourceMappingURL=WorkbenchViews.js.map