import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {IViewPluginDesc} from 'tdp_core';
import {IOrdinoAppState, addView, changeFocus} from '..';
import {views} from '../base/constants';
import {DetailViewChooser} from './DetailViewChooser';

// these props should be made optional
export function DummyWorkbench(props: {view: IViewPluginDesc | null}) {
    const ordino: IOrdinoAppState = useSelector<any>((state) => state.ordino) as IOrdinoAppState;
    const dispatch = useDispatch();
    const [embedded, setEmbedded] = React.useState<boolean>(true);

    return (
        <>
            <div
                className={`ordino-workbench empty d-flex align-items-stretch border-top border-start border-3 ${embedded ? 'expanded' : 'collapsed'
                    }`}
                data-ordino-workbench-type="empty"
            >
                <DetailViewChooser
                    index={props.view ? props.view.index : ordino.focusViewIndex + 1}
                    embedded={embedded}
                    setEmbedded={setEmbedded}
                    views={views}
                    selectedView={props.view}
                    onSelectedView={(view, viewIndex) => {
                        // TODO create addOrReplaceViewReducer
                        dispatch(
                            addView({
                                id: view.id,
                                name: view.name,
                                index: viewIndex,
                                selection: [],
                                filters: []
                            })
                        );
                        //this timeout is needed for the animation

                        setTimeout(() => {
                            dispatch(
                                changeFocus({
                                    index: viewIndex
                                })
                            );
                        }, 0);
                    }}
                />
            </div>
        </>
    );
}
