import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { views } from '../base/constants';
import { changeFocus, replaceView, addSelection } from '../store/ordinoSlice';
import { DetailViewChooser } from './DetailViewChooser';
import { EWorkbenchType } from './Filmstrip';
import { Lineup } from './lite';
// these props should be made optional
export function Workbench(props) {
    var _a;
    const [embedded, setEmbedded] = React.useState(false);
    const dispatch = useDispatch();
    const ordino = useSelector((state) => state.ordino);
    const chooserIsOpenClass = props.type === EWorkbenchType.FOCUS && ((_a = props.view.selections) === null || _a === void 0 ? void 0 : _a.length) && ordino.views.length - 1 === props.view.index ? 'open-chooser' : '';
    const setSelection = React.useMemo(() => (s) => {
        dispatch(addSelection({ index: props.view.index, newSelection: Object.keys(s.selectedRowIds) }));
    }, []);
    return (React.createElement("div", { style: props.style, className: `d-flex align-items-stretch ordino-workbench ${props.type} ${chooserIsOpenClass}` },
        React.createElement(React.Fragment, null,
            props.view.index !== 0 ? (React.createElement(DetailViewChooser, { index: props.view.index, embedded: embedded, setEmbedded: setEmbedded, views: views, selectedView: props.view, onSelectedView: (view, viewIndex) => {
                    dispatch(replaceView({
                        id: view.id,
                        name: view.name,
                        index: viewIndex,
                        selection: [],
                        filters: []
                    }));
                    //this timeout is needed for the animation
                    setTimeout(() => {
                        dispatch(changeFocus({
                            index: viewIndex
                        }));
                    }, 0);
                } })) : null,
            React.createElement("div", { className: `viewContent w-100 py-7` },
                React.createElement(Lineup, { onSelectionChanged: setSelection })))));
}
//# sourceMappingURL=Workbench.js.map