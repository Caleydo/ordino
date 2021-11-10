import React from 'react';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { addSelection } from '../store/ordinoSlice';
import { EWorkbenchType } from './Filmstrip';
import { EDragTypes } from './workbench/utils';
import { WorkbenchViews } from './workbench/WorkbenchViews';
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
    const [embedded, setEmbedded] = React.useState(false);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: EDragTypes.ADD,
        drop: () => { console.log('dropped'); return true; },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), []);
    // console.log(workbenchWidth, workbenchHeight, workbenchLayout);
    const chooserIsOpenClass = props.type === EWorkbenchType.FOCUS && ((_a = props.workbench.selections) === null || _a === void 0 ? void 0 : _a.length) && ordino.workbenches.length - 1 === props.workbench.index ? 'open-chooser' : '';
    const setSelection = React.useMemo(() => (s) => {
        dispatch(addSelection({ workbenchIndex: props.workbench.index, viewIndex: 0, newSelection: Object.keys(s.selectedRowIds) }));
    }, []);
    // const children = React.useMemo(() => {
    //     return props.workbench.views.map((d: IWorkbenchView, i) => {
    //         return (
    //             <div key={`randomComp${i}`} className = "shadow p-3 m-3 bg-body workbenchView rounded">
    //                 <Lineup onSelectionChanged={setSelection} />
    //             </div>
    //         );
    //     });
    //   }, [props.workbench.views.length]);
    console.log(ordino.workbenches[0].startingView);
    return (React.createElement("div", { style: props.style, className: `d-flex align-items-stretch ordino-workbench ${props.type} ${chooserIsOpenClass}` },
        React.createElement(React.Fragment, null,
            React.createElement(WorkbenchViews, { currentView: props.workbench.startingView }))));
}
//# sourceMappingURL=Workbench.js.map