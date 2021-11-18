import React from 'react';
import { addWorkbench, changeFocus } from '..';
import { views } from '../base/constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { DetailViewChooser } from './DetailViewChooser';
// these props should be made optional
export function DummyWorkbench(props) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [embedded, setEmbedded] = React.useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: `ordino-workbench empty d-flex align-items-stretch ${embedded ? 'expanded' : 'collapsed'}`, "data-ordino-workbench-type": "empty" },
            React.createElement(DetailViewChooser, { index: props.view ? props.view.index : ordino.focusViewIndex + 1, embedded: embedded, setEmbedded: setEmbedded, views: views, selectedView: props.view, onSelectedView: (view, viewIndex) => {
                    // TODO create addOrReplaceViewReducer
                    dispatch(addWorkbench({
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