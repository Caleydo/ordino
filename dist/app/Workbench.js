import React, { useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import GridLayout from 'react-grid-layout';
import { views } from '../base/constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { changeFocus, addSelection, replaceWorkbench } from '../store/ordinoSlice';
import { DetailViewChooser } from './DetailViewChooser';
import { EWorkbenchType } from './Filmstrip';
import { Lineup } from './lite';
// tslint:disable-next-line:variable-name
// const GridLayoutWithWitdth = WidthProvider(GridLayout);
// function takeSpace(layout: GridLayout.Layout[]) {
//     const counter = 0;
//     while(true) {
//         layout[counter];
//     }
// }
function findBiggestViewIndex(layout, height, width) {
    let counter = 0;
    for (const j of layout) {
        if (j.h === height || j.w === width) {
            return counter;
        }
        counter += 1;
    }
}
const WORKBENCH_PADDING = 50;
// these props should be made optional
export function Workbench(props) {
    var _a;
    const [workbenchWidth, setWorkbenchWidth] = React.useState(1000);
    const [workbenchHeight, setWorkbenchHeight] = React.useState(1000);
    const workbenchRef = useRef(null);
    const [embedded, setEmbedded] = React.useState(false);
    const [workbenchLayout, setWorkbenchLayout] = useState([
        { i: 'randomComp0', x: 0, y: 0, w: workbenchWidth, h: workbenchHeight },
    ]);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    console.log(workbenchLayout);
    // console.log(workbenchWidth, workbenchHeight, workbenchLayout);
    const chooserIsOpenClass = props.type === EWorkbenchType.FOCUS && ((_a = props.workbench.selections) === null || _a === void 0 ? void 0 : _a.length) && ordino.workbenches.length - 1 === props.workbench.index ? 'open-chooser' : '';
    const setSelection = React.useMemo(() => (s) => {
        dispatch(addSelection({ workbenchIndex: props.workbench.index, viewIndex: 0, newSelection: Object.keys(s.selectedRowIds) }));
    }, []);
    //this use effect is for keeping the width/height consistent
    useEffect(() => {
        if (workbenchRef) {
            setWorkbenchWidth(workbenchRef.current.offsetWidth - WORKBENCH_PADDING);
            setWorkbenchHeight(workbenchRef.current.offsetHeight - WORKBENCH_PADDING);
            setWorkbenchLayout([
                { i: 'randomComp0', x: 0, y: 0, w: workbenchRef.current.offsetWidth - WORKBENCH_PADDING, h: workbenchRef.current.offsetHeight - WORKBENCH_PADDING },
            ]);
        }
    }, [workbenchRef]);
    // //this use effect allows for adding views to properly shrink/take the space of other views.
    useEffect(() => {
        const layoutCopy = JSON.parse(JSON.stringify(workbenchLayout));
        if (props.workbench.views.length > workbenchLayout.length) {
            const biggestViewIndex = findBiggestViewIndex(workbenchLayout, workbenchHeight, workbenchWidth);
            const biggestView = workbenchLayout[biggestViewIndex];
            // console.log(biggestView);
            if (biggestView.h === workbenchHeight) {
                layoutCopy[biggestViewIndex].h = biggestView.h / 2;
                layoutCopy.push({ i: `randomComp${props.workbench.views.length - 1}`, x: biggestView.x, y: biggestView.h / 2, w: biggestView.w, h: biggestView.h / 2 });
            }
            else if (biggestView.w === workbenchWidth) {
                layoutCopy[biggestViewIndex].w = biggestView.w / 2;
                layoutCopy.push({ i: `randomComp${props.workbench.views.length - 1}`, x: biggestView.w / 2, y: biggestView.y, w: biggestView.w / 2, h: biggestView.h });
            }
            setWorkbenchLayout(layoutCopy);
        }
    }, [props.workbench.views.length]);
    const fixTopLayout = (layout) => {
        const layoutCopy = JSON.parse(JSON.stringify(layout));
        console.log(JSON.parse(JSON.stringify(layoutCopy)), workbenchWidth);
        const topLayouts = layoutCopy.filter((l) => l.y === 0);
        if (topLayouts.length === 1) {
            const currentTopLayout = topLayouts[0];
            if (currentTopLayout.w === workbenchWidth) {
                return layoutCopy;
            }
            else {
                console.log('editing');
                const layoutToBeMoved = layoutCopy.filter((l) => l.w === workbenchWidth - currentTopLayout.w && l.y !== 0 && l.h === currentTopLayout.h)[0];
                layoutToBeMoved.y = 0;
                layoutToBeMoved.x = currentTopLayout.w;
                // console.log(layoutToBeMoved);
            }
        }
        return layoutCopy;
    };
    const fixBottomLayout = (layout) => {
        const layoutCopy = JSON.parse(JSON.stringify(layout));
        console.log(JSON.parse(JSON.stringify(layoutCopy)));
        const bottomLayouts = layoutCopy.filter((l) => l.y !== 0);
        if (bottomLayouts.length > 1) {
            if (bottomLayouts[0].y === bottomLayouts[1].y) {
                return layoutCopy;
            }
            else if (bottomLayouts[0].y < bottomLayouts[1].y) {
                bottomLayouts[1].y = bottomLayouts[0].y;
                bottomLayouts[1].x = bottomLayouts[0].w;
            }
            else {
                bottomLayouts[0].y = bottomLayouts[1].y;
                bottomLayouts[0].x = bottomLayouts[1].w;
            }
        }
        return layoutCopy;
    };
    const onLayoutChange = useMemo(() => (layout) => {
        // console.log(JSON.parse(JSON.stringify(layout)));
        if (layout.length === 1) {
            setWorkbenchLayout(layout);
            return;
        }
        let newLayout = fixTopLayout(layout);
        newLayout = fixBottomLayout(newLayout);
        console.log(JSON.parse(JSON.stringify(newLayout)));
        // fixBottomLayout(layout);
        setWorkbenchLayout(newLayout);
    }, [workbenchWidth, workbenchHeight, workbenchLayout]);
    console.log(onLayoutChange);
    const children = React.useMemo(() => {
        return props.workbench.views.map((d, i) => {
            return (React.createElement("div", { key: `randomComp${i}`, className: "shadow p-3 m-3 bg-body workbenchView rounded" },
                React.createElement(Lineup, { onSelectionChanged: setSelection })));
        });
    }, [props.workbench.views.length]);
    return (React.createElement("div", { ref: workbenchRef, style: props.style, className: `d-flex align-items-stretch ordino-workbench ${props.type} ${chooserIsOpenClass}` },
        React.createElement(React.Fragment, null,
            props.workbench.index !== 0 ? (React.createElement(DetailViewChooser, { index: props.workbench.index, embedded: embedded, setEmbedded: setEmbedded, views: views, selectedView: props.workbench.views[0], onSelectedView: (view, viewIndex) => {
                    dispatch(replaceWorkbench({
                        workbenchIndex: props.workbench.index,
                        newWorkbench: {
                            index: 0,
                            views: [
                                {
                                    id: view.id,
                                    name: view.name,
                                    index: viewIndex,
                                    selection: [],
                                    filters: []
                                }
                            ],
                            id: view.id,
                            name: view.name,
                            selections: [],
                            filters: []
                        }
                    }));
                    //this timeout is needed for the animation
                    setTimeout(() => {
                        dispatch(changeFocus({
                            index: viewIndex
                        }));
                    }, 0);
                } })) : null,
            React.createElement(GridLayout, { key: workbenchWidth, className: "layout", layout: workbenchLayout, rowHeight: 1, cols: workbenchWidth, width: workbenchWidth, margin: [20, 0], containerPadding: [0, 0], onLayoutChange: onLayoutChange }, children))));
}
//# sourceMappingURL=Workbench.js.map