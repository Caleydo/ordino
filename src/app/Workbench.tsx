import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {views} from '../base/constants';
import {IOrdinoAppState, changeFocus, replaceView, IOrdinoViewPluginDesc, addSelection, addView} from '../store/ordinoSlice';
import {ViewChooser} from './ViewChooser';
import {EWorkbenchType} from './Filmstrip';
import {Lineup} from './lite';

interface IWorkbenchProps {
    view: IOrdinoViewPluginDesc;
    type?: EWorkbenchType;
    style?: React.CSSProperties;
}


export function Workbench({view, type = EWorkbenchType.PREVIOUS, style = {}}) {
    const dispatch = useDispatch();
    const ordino: any = useSelector<any>((state) => state.ordino) as any;
    const setSelection = React.useMemo(() => (s) => {
        dispatch(addSelection({index: view.index, newSelection: Object.keys(s.selectedRowIds)}));
    }, []);

    return (
        <div style={style} className={`d-flex align-items-stretch ordino-workbench ${type}`}>
            <>
                {view.index !== 0 ? (
                    <ViewChooser
                        index={view.index}
                        views={views}
                        selectedView={view}
                        onSelectedView={(view, viewIndex) => {
                            dispatch(
                                replaceView({
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
                ) : null}

                <div className={`viewContent w-100 py-7`}>
                    <Lineup onSelectionChanged={setSelection} />
                </div>
                <ViewChooser
                    index={ordino.focusViewIndex + 1}
                    views={views}
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
                        setTimeout(() => {
                            dispatch(
                                changeFocus({
                                    index: viewIndex
                                })
                            );
                        }, 0);
                    }}
                />
            </>
        </div>
    );
}
