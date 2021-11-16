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
    const [{ isOver }, drop] = useDrop(() => ({
        accept: [EDragTypes.ADD, EDragTypes.MOVE],
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), []);

    if(!view) {
        return <div></div>;
    }

    return (
        <div ref={drop} className = "position-relative shadow bg-body workbenchView rounded">
            <MoveButton view={view}/>
            <Lineup/>
            {isOver ? <DropOverlay view={view}/> : null }
        </div>
    );
}
