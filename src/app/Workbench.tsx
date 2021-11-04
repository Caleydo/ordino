import React from 'react';
import Split from 'react-split';
import {views} from '../base/constants';
import {useAppDispatch, useAppSelector} from '../hooks';
import { changeFocus, addSelection, IWorkbench, replaceWorkbench} from '../store/ordinoSlice';
import {DetailViewChooser} from './DetailViewChooser';
import {EWorkbenchType} from './Filmstrip';
import {Lineup} from './lite';

// these props should be made optional
export function Workbench(props: {
    workbench: IWorkbench;
    type: EWorkbenchType;
    style: React.CSSProperties
}) {
    const [embedded, setEmbedded] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    const chooserIsOpenClass = props.type === EWorkbenchType.FOCUS && props.workbench.selections?.length && ordino.workbenches.length - 1 === props.workbench.index ? 'open-chooser' : '';

    const setSelection = React.useMemo(() => (s) => {
        console.log(s);
        dispatch(addSelection({workbenchIndex: props.workbench.index, viewIndex: 0, newSelection: Object.keys(s.selectedRowIds)}));
    }, []);

    return (
        <div style={props.style} className={`d-flex align-items-stretch ordino-workbench ${props.type} ${chooserIsOpenClass}`}>
            <>
                {props.workbench.index !== 0 ? (
                    <DetailViewChooser
                        index={props.workbench.index}
                        embedded={embedded}
                        setEmbedded={setEmbedded}
                        views={views}
                        selectedView={props.workbench.views[0] as any}
                        onSelectedView={(view, viewIndex) => {
                            dispatch(
                                replaceWorkbench({
                                    workbenchIndex: props.workbench.index,
                                    newWorkbench:
                                    {
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
                                    }
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


                <Split className = "split viewContent w-100 py-7" gutterSize={20} key={props.workbench.views.length}>
                    {props.workbench.views.map((d, i) => {
                        return (
                            <div key={`randomComp${i}`} className = "shadow p-3 m-3 bg-body workbenchView rounded">
                                <Lineup onSelectionChanged={setSelection} />
                            </div>
                        );
                    })}
                </Split>
            </>
        </div>
    );
}
