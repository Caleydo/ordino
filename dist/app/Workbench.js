import React from 'react';
import { changeFocus, addWorkbench, replaceWorkbench } from '../store/ordinoSlice';
import { EWorkbenchType } from './Filmstrip';
import { useAppDispatch, useAppSelector } from '../hooks';
import { WorkbenchViews } from './workbench/WorkbenchViews';
export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const ref = React.useRef(null);
    const showNextChooser = workbench.index === ordino.workbenches.length - 1;
    const onAddView = React.useCallback((view, viewIndex) => {
        dispatch(addWorkbench({
            viewDirection: 'horizontal',
            views: [{ viewType: 'Ranking', filters: [] }],
            transitionOptions: [],
            columnDescs: [],
            data: {},
            entityId: view.id,
            name: view.name,
            index: viewIndex,
            selections: [],
        }));
        setTimeout(() => dispatch(changeFocus({ index: viewIndex })), 0);
    }, []);
    const onReplaceView = React.useCallback((view, viewIndex) => {
        dispatch(replaceWorkbench({ workbenchIndex: viewIndex, newWorkbench: {
                viewDirection: 'vertical',
                views: [{}],
                id: view.id,
                name: view.name,
                index: viewIndex,
                selections: [],
                filters: []
            } }));
        setTimeout(() => dispatch(changeFocus({ index: viewIndex })), 0);
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: ref, className: `d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusViewIndex === 0 ? 'start' : ''}` },
            React.createElement(React.Fragment, null,
                React.createElement(WorkbenchViews, { index: workbench.index })))));
}
//# sourceMappingURL=Workbench.js.map