import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addView, changeFocus } from '..';
import { views } from '../base/constants';
import { DetailViewChooser } from './DetailViewChooser';
// these props should be made optional
export function DummyWorkbench(props) {
    const ordino = useSelector((state) => state.ordino);
    const dispatch = useDispatch();
    const [embedded, setEmbedded] = React.useState(true);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: `ordino-workbench empty d-flex align-items-stretch border-top border-start border-3 ${embedded ? 'expanded' : 'collapsed'}`, "data-ordino-workbench-type": "empty" },
            React.createElement(DetailViewChooser, { index: props.view ? props.view.index : ordino.focusViewIndex + 1, embedded: embedded, setEmbedded: setEmbedded, views: views, selectedView: props.view, onSelectedView: (view, viewIndex) => {
                    // TODO create addOrReplaceViewReducer
                    dispatch(addView({
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
                } }))));
}
//# sourceMappingURL=DummyWorkbench.js.map