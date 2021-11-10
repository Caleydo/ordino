import {auto} from '@popperjs/core';
import * as React from 'react';
import { useDrop } from 'react-dnd';
import {addView, useAppDispatch, useAppSelector} from '../..';
import {IWorkbenchView} from '../../store';
import {WorkbenchBottomIcon} from './icons/WorkbenchBottomIcon';
import {WorkbenchLeftIcon} from './icons/WorkbenchLeftIcon';
import {WorkbenchRightIcon} from './icons/WorkbenchRightIcon';
import {WorkbenchTopIcon} from './icons/WorkbenchTopIcon';

import {EDragTypes} from './utils';

export interface IDropOverlayProps {
    view: IWorkbenchView;
}

export function DropOverlay({
    view
}: IDropOverlayProps) {

    // const dispatch = useAppDispatch();
    // const ordino = useAppSelector((state) => state.ordino);

    // const [{ isOver }, drop] = useDrop(() => ({
    //     accept: EDragTypes.ADD,
    //     drop: () => {
    //         console.log('droppin in ' + viewNum);
    //         dispatch(addView({
    //             workbenchIndex: ordino.focusViewIndex,
    //             view: {
    //                 id: 'view_0',
    //                 index: 0,
    //                 name: 'Start view',
    //                 selection: 'multiple',
    //                 selections: [],
    //                 group: {
    //                     name: 'General',
    //                     order: 10
    //                 }
    //                 }
    //         }));
    //     },
    //     collect: (monitor) => ({
    //         isOver: !!monitor.isOver(),
    //     }),
    // }), []);

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 1,
                opacity: .5,
                backgroundColor: 'lightgray',
            }}
        >
            <WorkbenchBottomIcon view={view}/>
            <WorkbenchTopIcon view={view}/>
            <WorkbenchLeftIcon view={view}/>
            <WorkbenchRightIcon view={view}/>
        </div>
    );
}
