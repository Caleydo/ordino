import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {views} from '../base/constants';
import {IOrdinoAppState, changeFocus, replaceView, IOrdinoViewPluginDesc} from '../store/ordinoSlice';
import {DetailViewChooser} from './DetailViewChooser';
import {Lineup} from './lite';

// these props should be made optional
export function Workbench(props: {
    view: IOrdinoViewPluginDesc;
    type: 'Previous' | 'Context' | 'Focus' | 'Next' | 'First' | 'Next_DVC';
}) {
    const [embedded, setEmbedded] = React.useState<boolean>(false);

    const ordino: IOrdinoAppState = useSelector<any>((state) => state.ordino) as IOrdinoAppState;
    const dispatch = useDispatch();

    const classNames = {
        Context: 'context border-top border-3 border-success',
        Focus: 'focus border border-3 border-bottom-0 border-primary',
        Next: `next ${props.view.index !== ordino.previousFocusIndex && props.view.index !== ordino.previousFocusIndex - 1
            ? 'notransition'
            : ''
            }`,
        Next_DVC: `next_dvc overflow-hidden border-top border-start border-3 ${embedded ? 'expanded' : 'collapsed'
            }`,
        First: 'first border border-3 border-bottom-0 border-start-0 border-primary',
        Previous: `previous ${props.view.index !== ordino.previousFocusIndex && props.view.index !== ordino.previousFocusIndex - 1
            ? 'notransition'
            : ''
            }`
    };

    return (
        <div className={`d-flex ordino-workbench ${classNames[props.type]}`}>
            <>
                {props.type === 'Focus' || props.type === 'Next_DVC' ? (
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
                    <Lineup/>
                </div>
            </>
        </div>
    );
}
