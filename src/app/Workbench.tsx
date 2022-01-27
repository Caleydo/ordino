import React, {useEffect, useRef, useState} from 'react';
import {useMemo} from 'react';
import {useDrop} from 'react-dnd';
import Split from 'react-split';
// import Split from 'react-split-grid'

import {views} from '../base/constants';
import { changeFocus, addView, addWorkbench, EViewDirections, replaceWorkbench, IWorkbench, EWorkbenchDirection} from '../store/ordinoSlice';
import {EExpandMode, EViewChooserMode, ViewChooser} from './ViewChooser';
import {EWorkbenchType} from './Filmstrip';
import {Lineup} from './lite';
import {IViewPluginDesc} from 'tdp_core';
import {useAppDispatch, useAppSelector} from '../hooks';
import {WorkbenchViews} from './workbench/WorkbenchViews';
import {colorPalette} from './Breadcrumb';

interface IWorkbenchProps {
    workbench: IWorkbench;
    type?: EWorkbenchType;
}

export function Workbench({workbench, type = EWorkbenchType.PREVIOUS}: IWorkbenchProps) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const ref = React.useRef(null);


    const showNextChooser = workbench.index === ordino.workbenches.length - 1;

    const onAddView = React.useCallback((view: IViewPluginDesc, viewIndex: number) => {
        dispatch(
            addWorkbench({
                viewDirection: EWorkbenchDirection.HORIZONTAL,
                views: [{viewType: 'Ranking', filters: [], index: 0}],
                transitionOptions: [],
                columnDescs: [],
                data: {},
                entityId: view.id,
                name: view.name,
                index: viewIndex,
                selectionIds: [],
            })
        );
        setTimeout(() => dispatch(changeFocus({index: viewIndex})), 0);
    }, []);


    const onReplaceView = React.useCallback((view: IViewPluginDesc, viewIndex: number) => {
        dispatch(
            replaceWorkbench({workbenchIndex: viewIndex, newWorkbench: {
                viewDirection: EWorkbenchDirection.HORIZONTAL,
                views: [{viewType: 'Ranking', filters: [], index: 0}],
                transitionOptions: [],
                columnDescs: [],
                data: {},
                entityId: view.id,
                name: view.name,
                index: viewIndex,
                selectionIds: [],
            }})
        );
        setTimeout(() => dispatch(changeFocus({index: viewIndex})), 0);
    }, []);

    return (<>
        <div ref={ref} className={`d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusViewIndex === 0 ? 'start' : ''}`} style={{borderTopColor: colorPalette[workbench.index]}} >
            <>
                {/* {workbench.index !== 0 && (type === EWorkbenchType.FOCUS || type === EWorkbenchType.NEXT) ? (
                    <ViewChooser
                        views={views}
                        selectedView={null}
                        onSelectedView={(v) => onReplaceView(v, workbench.index)}
                        mode={EViewChooserMode.OVERLAY}
                        expand={EExpandMode.RIGHT}
                    />
                ) : null} */}

                <WorkbenchViews index={workbench.index} onlyRanking={type === EWorkbenchType.CONTEXT}/>
            </>
        </div>
        {/* {showNextChooser &&
            <ViewChooser
                views={views}
                onSelectedView={(view) => onAddView(view, ordino.focusViewIndex + 1)}
                mode={EViewChooserMode.OVERLAY}
                expand={EExpandMode.LEFT}
                showBurgerMenu={false}
            />} */}
    </>
    );
}

