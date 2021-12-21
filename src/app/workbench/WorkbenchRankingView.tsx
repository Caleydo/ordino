import * as React from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {useAppDispatch, useAppSelector} from '../..';
import {IWorkbenchView, removeView, setWorkbenchDirection} from '../../store';
import {colorPalette} from '../Breadcrumb';

import {Lineup} from '../lite';
import {DropOverlay} from './DropOverlay';
import {MoveButton} from './MoveButton';
import {useLoadViewPlugin} from './useLoadViewPlugin';
import {EDragTypes} from './utils';

export interface IWorkbenchRankingViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}

export function WorkbenchRankingView({
    workbenchIndex,
    view
}: IWorkbenchRankingViewProps) {
    const [ref, instance] = useLoadViewPlugin(view.id, workbenchIndex);

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

    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.MOVE,
        item: {type: EDragTypes.MOVE, viewId: view.id, index: view.index},
    }), [view.id, view.index]);

    return (
        <>
            <div ref={drop} id={view.id} className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
                {workbenchIndex === ordino.focusViewIndex ?
                    <>
                        <div className="view-actions">
                            <button type="button" onClick={() => dispatch(removeView({workbenchIndex, viewIndex: view.index}))} className="btn-close" />
                        </div>

                        <div ref={drag} className="view-parameters d-flex">
                            <div>
                                <button type="button" className="chevronButton btn btn-outline-primary btn-sm align-middle m-1" style={{color: colorPalette[workbenchIndex], borderColor: colorPalette[workbenchIndex]}}> <i className="flex-grow-1 fas fa-chevron-right m-1"/>Edit View</button>
                            </div>
                            <span className={'view-title row align-items-center m-1'}><strong>Ranking</strong></span>
                        </div>
                    </> :
                    <>
                        <div ref={drag} className="view-parameters d-flex">
                            <span className={'view-title row align-items-center m-1'}><strong>Ranking</strong></span>
                        </div>
                    </>
                }
                <div ref={ref} className="inner">
                </div>

                {isOver && canDrop ? <DropOverlay view={view} /> : null}
            </div>
        </>
    );
}
