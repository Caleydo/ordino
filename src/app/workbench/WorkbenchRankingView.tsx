import * as React from 'react';
import {useDrop} from 'react-dnd';
import {useAppDispatch, useAppSelector} from '../..';
import {IWorkbenchView, removeView} from '../../store';

import {Lineup} from '../lite';
import {DropOverlay} from './DropOverlay';
import {MoveButton} from './MoveButton';
import {useLoadViewPlugin} from './useLoadViewPlugin';
import {EDragTypes} from './utils';

export interface IWorkbenchRankingViewProps {
    view: IWorkbenchView;
}

export function WorkbenchRankingView({
    view
}: IWorkbenchRankingViewProps) {
    const [ref, instance] = useLoadViewPlugin(view.id);

    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{isOver, canDrop}, drop] = useDrop(() => ({
        accept: [EDragTypes.MOVE],
        canDrop: (d: {type: EDragTypes, viewId: string}) => {
            return d.viewId !== view.id;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [view.id]);

    console.log(ordino);
    console.log(view);

    return (
        <>
            <div ref={drop} className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
                <div className="view-actions">
                    <button type="button" onClick={() => dispatch(removeView({workbenchIndex: ordino.focusViewIndex, viewIndex: view.index}))} className="btn-close" />
                </div>

                <div className="view-parameters"></div>
                <div ref={ref} className="inner">

                </div>
                {isOver && canDrop ? <DropOverlay view={view} /> : null}
            </div>
        </>
    );
}
