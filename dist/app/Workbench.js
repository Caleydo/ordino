import React from 'react';
// import Split from 'react-split-grid'
import { views } from '../base/constants';
import { changeFocus, addWorkbench, replaceWorkbench } from '../store/ordinoSlice';
import { EExpandMode, EViewChooserMode, ViewChooser } from './ViewChooser';
import { EWorkbenchType } from './Filmstrip';
import { useAppDispatch, useAppSelector } from '../hooks';
import { WorkbenchViews } from './workbench/WorkbenchViews';
export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS, onScrollTo }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (!ref.current || ordino.workbenches.length <= 2) {
            return;
        }
        if ((type === EWorkbenchType.CONTEXT)) {
            onScrollTo(ref);
        }
        else if (ordino.focusViewIndex === 0) {
            onScrollTo(null);
        }
    }, [ref.current, ordino.focusViewIndex]);
    const showNextChooser = workbench.index === ordino.workbenches.length - 1;
    const onAddView = React.useCallback((view, viewIndex) => {
        dispatch(addWorkbench({
            viewDirection: 'horizontal',
            views: [{}],
            data: {},
            id: view.id,
            name: view.name,
            index: viewIndex,
            selections: [],
            filters: []
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
        React.createElement("div", { ref: ref, className: `d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.workbenches.length === 1 ? 'start' : ''}` },
            React.createElement(React.Fragment, null,
                workbench.index !== 0 && (type === EWorkbenchType.FOCUS || type === EWorkbenchType.NEXT) ? (React.createElement(ViewChooser, { views: views, selectedView: null, onSelectedView: (v) => onReplaceView(v, workbench.index), mode: EViewChooserMode.OVERLAY, expand: EExpandMode.RIGHT })) : null,
                React.createElement(WorkbenchViews, { index: workbench.index }))),
        showNextChooser &&
            React.createElement(ViewChooser, { views: views, onSelectedView: (view) => onAddView(view, ordino.focusViewIndex + 1), mode: EViewChooserMode.OVERLAY, expand: EExpandMode.LEFT, showBurgerMenu: false })));
}
//# sourceMappingURL=Workbench.js.map