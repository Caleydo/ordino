import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {views} from '../base/constants';
import {IOrdinoAppState, changeFocus, replaceView, IOrdinoViewPluginDesc, addSelection, addView} from '../store/ordinoSlice';
import {ECollapseDirection, ViewChooser} from './ViewChooser';
import {EWorkbenchType} from './Filmstrip';
import {Lineup} from './lite';
import {IViewPluginDesc} from 'tdp_core';

interface IWorkbenchProps {
    view: IOrdinoViewPluginDesc;
    type?: EWorkbenchType;
}


export function Workbench({view, type = EWorkbenchType.PREVIOUS}: IWorkbenchProps) {
    const dispatch = useDispatch();
    const ordino: any = useSelector<any>((state) => state.ordino) as any;
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (type === EWorkbenchType.FOCUS && ordino.views.length > 2) {
            ref.current.scrollIntoView({block: 'center', behavior: 'smooth', inline: 'end'});
        }
    }, [ref.current, ordino]);


    const showNextChooser = type === EWorkbenchType.FOCUS && view.index === ordino.views.length - 1;

    const onAddView = (view: IViewPluginDesc, viewIndex) => {
        dispatch(
            replaceView({
                id: view.id,
                name: view.name,
                index: ordino.focusViewIndex + 1,
                selection: [],
                filters: []
            })
        );
    };


    const onReplaceView = (view: IViewPluginDesc) => {
        dispatch(
            replaceView({
                id: view.id,
                name: view.name,
                index: view.index,
                selection: [],
                filters: []
            })
        );
    };

    return (
        <div ref={ref} className={`d-flex align-items-stretch flex-shrink-0 ordino-workbench overflow-hidden ${type}`}>
            <>
                {view.index !== 0 && (type === EWorkbenchType.FOCUS || type === EWorkbenchType.NEXT) ? (
                    <ViewChooser
                        views={views}
                        selectedView={view}
                        collapseDirection={ECollapseDirection.RIGHT}
                        onSelectedView={onReplaceView}
                    />
                ) : null}

                <div className={`viewContent flex-shrink-1 w-100 py-7 mh-0 mw-0`}>
                    <Lineup onSelectionChanged={() => null} />
                </div>

                {showNextChooser &&
                    <ViewChooser
                        views={views}
                        onSelectedView={onAddView}
                    />}
            </>
        </div>
    );
}
