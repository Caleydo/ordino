import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {views} from '../base/constants';
import {replaceView, IOrdinoViewPluginDesc, changeFocus, addView} from '../store/ordinoSlice';
import {EExpandMode, EViewChooserMode, ViewChooser} from './ViewChooser';
import {EWorkbenchType} from './Filmstrip';
import {Lineup} from './lite';
import {IViewPluginDesc} from 'tdp_core';

interface IWorkbenchProps {
    view: IOrdinoViewPluginDesc;
    type?: EWorkbenchType;
    onScrollTo?: (ref: React.MutableRefObject<HTMLDivElement>) => void;
}


export function Workbench({view, type = EWorkbenchType.PREVIOUS, onScrollTo}: IWorkbenchProps) {
    const dispatch = useDispatch();
    const ordino: any = useSelector<any>((state) => state.ordino) as any;
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ordino.previousFocusIndex === ordino.focusViewIndex || !ref.current || ordino.views.length <= 2) {
            return;
        }

        if ((type === EWorkbenchType.CONTEXT)) {
            onScrollTo(ref);

        } else if (ordino.focusViewIndex === 0) {
            onScrollTo(null);
        }

    }, [ref.current, ordino.focusViewIndex]);

    const showNextChooser = view.index === ordino.views.length - 1;

    const onAddView = React.useCallback((view: IViewPluginDesc, viewIndex: number) => {
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
    }, []);


    const onReplaceView = React.useCallback((view: IViewPluginDesc, viewIndex: number) => {
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
    }, []);

    return (<>
        <div ref={ref} className={`d-flex align-items-stretch flex-shrink-0 ordino-workbench ${type} ${ordino.views.length === 1 ? 'start' : ''}`}>
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

                <div className={`viewContent flex-shrink-2 w-100 py-7 mh-0 mw-0 ${type !== EWorkbenchType.FOCUS ? 'overflow-hidden' : 'overflow-auto'}`}>
                    <Lineup onSelectionChanged={() => null} />
                </div>

            </>
        </div>
        {showNextChooser &&
            <ViewChooser
                views={views}
                onSelectedView={(view) => onAddView(view, ordino.focusViewIndex + 1)}
                mode={EViewChooserMode.OVERLAY}
                expand={EExpandMode.LEFT}
                showBurgerMenu={false}
            />}
    </>
    );
}
