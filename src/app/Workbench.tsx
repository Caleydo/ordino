import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {views} from '../base/constants';
import {replaceView, IOrdinoViewPluginDesc, changeFocus, addView, changeOffsetLeft} from '../store/ordinoSlice';
import {EExpandMode, EViewChooserMode, ViewChooser} from './ViewChooser';
import {EWorkbenchType} from './Filmstrip';
import {Lineup} from './lite';
import {IViewPluginDesc} from 'tdp_core';

interface IWorkbenchProps {
    view: IOrdinoViewPluginDesc;
    type?: EWorkbenchType;
    onScrollTo?: (scrollAmount: number) => void;
}


export function Workbench({view, type = EWorkbenchType.PREVIOUS, onScrollTo}: IWorkbenchProps) {
    const dispatch = useDispatch();
    const ordino: any = useSelector<any>((state) => state.ordino) as any;
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (type === EWorkbenchType.CONTEXT) {
            dispatch(
                changeOffsetLeft({
                    index: view.index,
                    offsetLeft: ref.current.offsetLeft || 0
                })
            );
        }
    }, [ref.current, ordino]);

    React.useEffect(() => {
        if (type === EWorkbenchType.FOCUS && ordino.views.length > 2) {
            if (ordino.previousFocusIndex === ordino.focusViewIndex) {
                return;
            }

            const offsetLeft = ordino.views.find((v) => v.index === view.index - 1)?.offsetLeft;
            const scrollAmount = ordino.previousFocusIndex < ordino.focusViewIndex ? offsetLeft : -offsetLeft;
            setTimeout(() => onScrollTo(scrollAmount), 0);
        }
    }, [ref.current, ordino]);

    const showNextChooser = type === EWorkbenchType.FOCUS && view.index === ordino.views.length - 1;

    const onAddView = (view: IViewPluginDesc, viewIndex: number) => {
        dispatch(
            addView({
                id: view.id,
                name: view.name,
                index: viewIndex,
                selection: [],
                filters: []
            })
        );
        setTimeout(() => dispatch(changeFocus({index: viewIndex})), 0);
    };


    const onReplaceView = (view: IViewPluginDesc, viewIndex: number) => {
        dispatch(
            replaceView({
                id: view.id,
                name: view.name,
                index: viewIndex,
                selection: [],
                filters: []
            })
        );
        setTimeout(() => dispatch(changeFocus({index: viewIndex})), 0);
    };

    return (
        <div ref={ref} className={`d-flex align-items-stretch flex-shrink-0 ordino-workbench overflow-hidden ${type}`}>
            <>
                {view.index !== 0 && (type === EWorkbenchType.FOCUS || type === EWorkbenchType.NEXT) ? (
                    <ViewChooser
                        views={views}
                        selectedView={view}
                        onSelectedView={(v) => onReplaceView(v, view.index)}
                        mode={EViewChooserMode.OVERLAY}
                        expand={EExpandMode.RIGHT}
                    />
                ) : null}

                <div className={`viewContent flex-shrink-1 w-100 py-7 mh-0 mw-0`}>
                    <Lineup onSelectionChanged={() => null} />
                </div>

                {showNextChooser &&
                    <ViewChooser
                        views={views}
                        onSelectedView={(view) => onAddView(view, ordino.focusViewIndex + 1)}
                        mode={EViewChooserMode.OVERLAY}
                        expand={EExpandMode.LEFT}
                    />}
            </>
        </div>
    );
}
