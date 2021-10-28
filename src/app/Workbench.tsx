import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {views} from '../base/constants';
import {IOrdinoAppState, changeFocus, replaceView, IOrdinoViewPluginDesc, addSelection} from '../store/ordinoSlice';
import {DetailViewChooser} from './DetailViewChooser';
import {EWorkbenchType} from './Filmstrip';
import {Lineup} from './lite';

// these props should be made optional
export function Workbench(props: {
    view: IOrdinoViewPluginDesc;
    type: EWorkbenchType;
    style: React.CSSProperties
}) {
    const [embedded, setEmbedded] = React.useState<boolean>(false);
    const dispatch = useDispatch();
    const ordino: any = useSelector<any>((state) => state.ordino) as any;

    const chooserIsOpenClass = props.type === EWorkbenchType.FOCUS && props.view.selections?.length && ordino.views.length - 1 === props.view.index ? 'open-chooser' : '';
    const setSelection = React.useMemo(() => (s) => {
        dispatch(addSelection({index: props.view.index, newSelection: Object.keys(s.selectedRowIds)}));
    }, []);

    return (
        <div style={props.style} className={`d-flex align-items-stretch ordino-workbench ${props.type} ${chooserIsOpenClass}`}>
            <>
                {props.view.index !== 0 ? (
                    <DetailViewChooser
                        index={props.view.index}
                        embedded={embedded}
                        setEmbedded={setEmbedded}
                        views={views}
                        selectedView={props.view}
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
            </>
        </div>
    );
}
