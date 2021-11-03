import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { views } from '../base/constants';
import { replaceView } from '../store/ordinoSlice';
import { ECollapseDirection, ViewChooser } from './ViewChooser';
import { EWorkbenchType } from './Filmstrip';
import { Lineup } from './lite';
export function Workbench({ view, type = EWorkbenchType.PREVIOUS }) {
    const dispatch = useDispatch();
    const ordino = useSelector((state) => state.ordino);
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (type === EWorkbenchType.FOCUS && ordino.views.length > 2) {
            ref.current.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'end' });
        }
    }, [ref.current, ordino]);
    const showNextChooser = type === EWorkbenchType.FOCUS && view.index === ordino.views.length - 1;
    const onAddView = (view, viewIndex) => {
        dispatch(replaceView({
            id: view.id,
            name: view.name,
            index: ordino.focusViewIndex + 1,
            selection: [],
            filters: []
        }));
    };
    const onReplaceView = (view) => {
        dispatch(replaceView({
            id: view.id,
            name: view.name,
            index: view.index,
            selection: [],
            filters: []
        }));
    };
    return (React.createElement("div", { ref: ref, className: `d-flex align-items-stretch flex-shrink-0 ordino-workbench overflow-hidden ${type}` },
        React.createElement(React.Fragment, null,
            view.index !== 0 && (type === EWorkbenchType.FOCUS || type === EWorkbenchType.NEXT) ? (React.createElement(ViewChooser, { views: views, selectedView: view, collapseDirection: ECollapseDirection.RIGHT, onSelectedView: onReplaceView })) : null,
            React.createElement("div", { className: `viewContent flex-shrink-1 w-100 py-7 mh-0 mw-0` },
                React.createElement(Lineup, { onSelectionChanged: () => null })),
            showNextChooser &&
                React.createElement(ViewChooser, { views: views, onSelectedView: onAddView }))));
}
//# sourceMappingURL=Workbench.js.map