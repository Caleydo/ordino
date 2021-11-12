import React from 'react';
// import Split from 'react-split-grid'
import { views } from '../base/constants';
import { replaceView, changeFocus, addView } from '../store/ordinoSlice';
import { EExpandMode, EViewChooserMode, ViewChooser } from './ViewChooser';
import { EWorkbenchType } from './Filmstrip';
import { Lineup } from './lite';
export function Workbench({ view, type = EWorkbenchType.PREVIOUS, onScrollTo }) {
    const dispatch = useDispatch();
    const ordino = useSelector((state) => state.ordino);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ordino.previousFocusIndex === ordino.focusViewIndex || !ref.current || ordino.views.length <= 2) {
            return;
        }
        if ((type === EWorkbenchType.CONTEXT)) {
            onScrollTo(ref);
        }
        else if (ordino.focusViewIndex === 0) {
            onScrollTo(null);
        }
    }, [ref.current, ordino.focusViewIndex]);
    const showNextChooser = view.index === ordino.views.length - 1;
    const onAddView = React.useCallback((view, viewIndex) => {
        dispatch(addView({
            id: view.id,
            name: view.name,
            index: viewIndex,
            selection: [],
            filters: []
        }));
        setTimeout(() => dispatch(changeFocus({ index: viewIndex })), 0);
    }, []);
    const onReplaceView = React.useCallback((view, viewIndex) => {
        dispatch(replaceView({
            id: view.id,
            name: view.name,
            index: viewIndex,
            selection: [],
            filters: []
        }));
        setTimeout(() => dispatch(changeFocus({ index: viewIndex })), 0);
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: ref, className: `d-flex align-items-stretch flex-shrink-0 ordino-workbench ${type} ${ordino.views.length === 1 ? 'start' : ''}` },
            React.createElement(React.Fragment, null,
                view.index !== 0 && (type === EWorkbenchType.FOCUS || type === EWorkbenchType.NEXT) ? (React.createElement(ViewChooser, { views: views, selectedView: view, onSelectedView: (v) => onReplaceView(v, view.index), mode: EViewChooserMode.OVERLAY, expand: EExpandMode.RIGHT })) : null,
                React.createElement("div", { className: `viewContent flex-shrink-2 w-100 py-7 mh-0 mw-0 ${type !== EWorkbenchType.FOCUS ? 'overflow-hidden' : 'overflow-auto'}` },
                    React.createElement(Lineup, { onSelectionChanged: () => null })))),
        showNextChooser &&
            React.createElement(ViewChooser, { views: views, onSelectedView: (view) => onAddView(view, ordino.focusViewIndex + 1), mode: EViewChooserMode.OVERLAY, expand: EExpandMode.LEFT, showBurgerMenu: false })));
}
//# sourceMappingURL=Workbench.js.map