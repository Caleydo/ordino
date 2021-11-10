import * as React from 'react';
import { WorkbenchBottomIcon } from './icons/WorkbenchBottomIcon';
import { WorkbenchLeftIcon } from './icons/WorkbenchLeftIcon';
import { WorkbenchRightIcon } from './icons/WorkbenchRightIcon';
import { WorkbenchTopIcon } from './icons/WorkbenchTopIcon';
export function DropOverlay({ view }) {
    // const dispatch = useAppDispatch();
    // const ordino = useAppSelector((state) => state.ordino);
    // const [{ isOver }, drop] = useDrop(() => ({
    //     accept: EDragTypes.ADD,
    //     drop: () => {
    //         console.log('droppin in ' + viewNum);
    //         dispatch(addView({
    //             workbenchIndex: ordino.focusViewIndex,
    //             view: {
    //                 id: 'view_0',
    //                 index: 0,
    //                 name: 'Start view',
    //                 selection: 'multiple',
    //                 selections: [],
    //                 group: {
    //                     name: 'General',
    //                     order: 10
    //                 }
    //                 }
    //         }));
    //     },
    //     collect: (monitor) => ({
    //         isOver: !!monitor.isOver(),
    //     }),
    // }), []);
    return (React.createElement("div", { style: {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: .5,
            backgroundColor: 'lightgray',
        } },
        React.createElement(WorkbenchBottomIcon, { view: view }),
        React.createElement(WorkbenchTopIcon, { view: view }),
        React.createElement(WorkbenchLeftIcon, { view: view }),
        React.createElement(WorkbenchRightIcon, { view: view })));
}
//# sourceMappingURL=DropOverlay.js.map