import React, {useEffect, useRef, useState} from 'react';
import {useMemo} from 'react';
import {useDrop} from 'react-dnd';
import Split from 'react-split';
// import Split from 'react-split-grid'

import {views} from '../base/constants';
import { changeFocus, addView, addWorkbench, EViewDirections, replaceWorkbench, IWorkbench} from '../store/ordinoSlice';
import {EExpandMode, EViewChooserMode, ViewChooser} from './ViewChooser';
import {EWorkbenchType} from './Filmstrip';
import {Lineup} from './lite';
import {IViewPluginDesc} from 'tdp_core';
import {useAppDispatch, useAppSelector} from '../hooks';
import {WorkbenchViews} from './workbench/WorkbenchViews';

interface IWorkbenchProps {
    workbench: IWorkbench;
    type?: EWorkbenchType;
    onScrollTo?: (ref: React.MutableRefObject<HTMLDivElement>) => void;
}

export function Workbench({workbench, type = EWorkbenchType.PREVIOUS, onScrollTo}: IWorkbenchProps) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (!ref.current || ordino.workbenches.length <= 2) {
            return;
        }

        if ((type === EWorkbenchType.CONTEXT)) {
            onScrollTo(ref);

        } else if (ordino.focusViewIndex === 0) {
            onScrollTo(null);
        }

    }, [ref.current, ordino.focusViewIndex]);

    const showNextChooser = workbench.index === ordino.workbenches.length - 1;

    const onAddView = React.useCallback((view: IViewPluginDesc, viewIndex: number) => {
        dispatch(
            addWorkbench({
                viewDirection: 'vertical',
                views: [{}],
                id: view.id,
                name: view.name,
                index: viewIndex,
                selections: [],
                filters: []
            })
        );
        setTimeout(() => dispatch(changeFocus({index: viewIndex})), 0);
    }, []);


    const onReplaceView = React.useCallback((view: IViewPluginDesc, viewIndex: number) => {
        dispatch(
            replaceWorkbench({workbenchIndex: viewIndex, newWorkbench: {
                viewDirection: 'vertical',
                views: [{}],
                id: view.id,
                name: view.name,
                index: viewIndex,
                selections: [],
                filters: []
            }})
        );
        setTimeout(() => dispatch(changeFocus({index: viewIndex})), 0);
    }, []);

    return (<>
        <div ref={ref} className={`d-flex ordino-workbench ${type} ${ordino.workbenches.length === 1 ? 'start' : ''}`}>
            <>
                {workbench.index !== 0 && (type === EWorkbenchType.FOCUS || type === EWorkbenchType.NEXT) ? (
                    <ViewChooser
                        views={views}
                        selectedView={null}
                        onSelectedView={(v) => onReplaceView(v, workbench.index)}
                        mode={EViewChooserMode.OVERLAY}
                        expand={EExpandMode.RIGHT}
                    />
                ) : null}

                <WorkbenchViews index={workbench.index}/>
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

