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

    return (<>
        <div ref={ref} className={`d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusViewIndex === 0 ? 'start' : ''}`} style={{borderTopColor: colorPalette[workbench.index]}} >
            <>
                <WorkbenchViews index={workbench.index} onlyRanking={type === EWorkbenchType.CONTEXT}/>
            </>
        </div>
    </>
    );
}

