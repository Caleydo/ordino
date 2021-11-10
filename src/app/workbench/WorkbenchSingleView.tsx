import * as React from 'react';
import { useDrop } from 'react-dnd';
import {addView, useAppDispatch, useAppSelector} from '../..';
import {IWorkbenchView} from '../../store';

import {Lineup} from '../lite';
import {DropOverlay} from './DropOverlay';
import {EDragTypes} from './utils';

export interface IWorkbenchSingleViewProps {
    view: IWorkbenchView;
}

export function WorkbenchSingleView({
    view
}: IWorkbenchSingleViewProps) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: EDragTypes.ADD,
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), []);

    return (
        <div ref={drop} className = "position-relative shadow bg-body workbenchView rounded">
            <Lineup/>
            {isOver ? <DropOverlay view={view}/> : null }
        </div>
    );
}
