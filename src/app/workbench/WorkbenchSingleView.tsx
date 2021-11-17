import * as React from 'react';
import { useDrop } from 'react-dnd';
import {IWorkbenchView} from '../../store';

import {Lineup} from '../lite';
import {DropOverlay} from './DropOverlay';
import {MoveButton} from './MoveButton';
import {EDragTypes} from './utils';

export interface IWorkbenchSingleViewProps {
    view: IWorkbenchView;
}

export function WorkbenchSingleView({
    view
}: IWorkbenchSingleViewProps) {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: [EDragTypes.MOVE],
        canDrop: (d: {type: EDragTypes, viewId: string}) => {
            return d.viewId !== view.id;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [view.id]);

    return (
        <div ref={drop} className = "position-relative shadow bg-body workbenchView rounded">
            <MoveButton view={view}/>
            <div style={{flex: '1 1 auto', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
                <span style={{fontSize: 30}}>
                {view.id}
                </span>
            </div>
            {isOver && canDrop ? <DropOverlay view={view}/> : null }
        </div>
    );
}
