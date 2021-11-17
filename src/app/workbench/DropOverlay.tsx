import {auto} from '@popperjs/core';
import * as React from 'react';
import { useDrop } from 'react-dnd';
import {addView, useAppDispatch, useAppSelector} from '../..';
import {IWorkbenchView} from '../../store';
import {WorkbenchBottomIcon} from './icons/WorkbenchBottomIcon';
import {WorkbenchLeftIcon} from './icons/WorkbenchLeftIcon';
import {WorkbenchRightIcon} from './icons/WorkbenchRightIcon';
import {WorkbenchSwitchIcon} from './icons/WorkbenchSwitchIcon';
import {WorkbenchTopIcon} from './icons/WorkbenchTopIcon';

import {EDragTypes} from './utils';

export interface IDropOverlayProps {
    view: IWorkbenchView;
}

export function DropOverlay({
    view
}: IDropOverlayProps) {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 1,
                opacity: 1,
                backgroundColor: 'lightgray',
            }}
        >
            <WorkbenchSwitchIcon view={view}/>
        </div>
    );
}
