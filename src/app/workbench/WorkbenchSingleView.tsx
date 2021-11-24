import * as React from 'react';
import { useDrop } from 'react-dnd';
import {useAppDispatch, useAppSelector} from '../..';
import {IWorkbenchView, removeView} from '../../store';

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
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
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
        <div ref={drop} className = "position-relative shadow bg-body workbenchView rounded flex-grow-1">
            <MoveButton view={view}/>
            <button type="button" onClick={() => dispatch(removeView({workbenchIndex: ordino.focusViewIndex, viewIndex: view.index}))} className="position-absolute btn bg-none end-0">
                <i className="fas fa-times"></i>
            </button>
            <div style={{flex: '1 1 auto', justifyContent: 'stretch', display: 'flex', alignItems: 'center'}}>

            </div>
            {isOver && canDrop ? <DropOverlay view={view}/> : null }
        </div>
    );
}
