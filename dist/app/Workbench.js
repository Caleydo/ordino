import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { views } from '../base/constants';
import { replaceView, changeFocus, addView, changeOffsetLeft } from '../store/ordinoSlice';
import { EExpandMode, EViewChooserMode, ViewChooser } from './ViewChooser';
import { EWorkbenchType } from './Filmstrip';
import { Lineup } from './lite';
export function Workbench({ view, type = EWorkbenchType.PREVIOUS, onScrollTo }) {
    const dispatch = useDispatch();
    const ordino = useSelector((state) => state.ordino);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (type === EWorkbenchType.CONTEXT) {
            dispatch(changeOffsetLeft({
                index: view.index,
                offsetLeft: ref.current.offsetLeft || 0
            }));
        }
    }, [ref.current, ordino]);
    React.useEffect(() => {
        var _a;
        if (type === EWorkbenchType.FOCUS && ordino.views.length > 2) {
            if (ordino.previousFocusIndex === ordino.focusViewIndex) {
                return;
            }
            const offsetLeft = (_a = ordino.views.find((v) => v.index === view.index - 1)) === null || _a === void 0 ? void 0 : _a.offsetLeft;
            const scrollAmount = ordino.previousFocusIndex < ordino.focusViewIndex ? offsetLeft : -offsetLeft;
            setTimeout(() => onScrollTo(scrollAmount), 0);
        }
    }, [ref.current, ordino]);
    const showNextChooser = type === EWorkbenchType.FOCUS && view.index === ordino.views.length - 1;
    const onAddView = (view, viewIndex) => {
        dispatch(addView({
            id: view.id,
            name: view.name,
            index: viewIndex,
            selection: [],
            filters: []
        }));
        setTimeout(() => dispatch(changeFocus({ index: viewIndex })), 0);
    };
    const onReplaceView = (view, viewIndex) => {
        dispatch(replaceView({
            id: view.id,
            name: view.name,
            index: viewIndex,
            selection: [],
            filters: []
        }));
        setTimeout(() => dispatch(changeFocus({ index: viewIndex })), 0);
    };
    return (React.createElement("div", { ref: ref, className: `d-flex align-items-stretch flex-shrink-0 ordino-workbench overflow-hidden ${type}` },
        React.createElement(React.Fragment, null,
            view.index !== 0 && (type === EWorkbenchType.FOCUS || type === EWorkbenchType.NEXT) ? (React.createElement(ViewChooser, { views: views, selectedView: view, onSelectedView: (v) => onReplaceView(v, view.index), mode: EViewChooserMode.OVERLAY, expand: EExpandMode.RIGHT })) : null,
            React.createElement("div", { className: `viewContent flex-shrink-1 w-100 py-7 mh-0 mw-0` },
                React.createElement(Lineup, { onSelectionChanged: () => null })),
            showNextChooser &&
                React.createElement(ViewChooser, { views: views, onSelectedView: (view) => onAddView(view, ordino.focusViewIndex + 1), mode: EViewChooserMode.OVERLAY, expand: EExpandMode.LEFT }))));
}
//# sourceMappingURL=Workbench.js.map