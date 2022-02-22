import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {useAppDispatch, useAppSelector} from '../..';
import {IViewPluginDesc, useAsync} from 'tdp_core';
import {IWorkbenchView, removeView, setView, setWorkbenchDirection} from '../../store';
import {findViewIndex} from '../../store/storeUtils';

import {Lineup} from '../lite';
import {EViewChooserMode, ViewChooser} from '../ViewChooser';
import {DropOverlay} from './DropOverlay';
import {MoveButton} from './MoveButton';
import {useLoadViewPlugin} from './useLoadViewPlugin';
import {EDragTypes} from './utils';
import {useLoadAvailableViews} from './useLoadAvailableViews';

export interface IWorkbenchRankingViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
}

export function WorkbenchRankingView({
    workbenchIndex,
    view,
    chooserOptions
}: IWorkbenchRankingViewProps) {
    const [editOpen, setEditOpen] = useState<boolean>(false);

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


    const viewIndex = useMemo(() => {
        return findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]);
    }, [ordino.workbenches[workbenchIndex].views]);

    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.MOVE,
        item: {type: EDragTypes.MOVE, viewId: view.id, index: viewIndex},
    }), [view.id, viewIndex]);

    return (
        <>
            <div ref={drop} id={view.id} className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
                {workbenchIndex === ordino.focusViewIndex ?
                    <>
                        <div className="view-actions">
                            <button type="button" onClick={() => dispatch(removeView({workbenchIndex, viewIndex}))} className="btn-close" />
                        </div>

                        <div ref={drag} className="view-parameters d-flex">
                            <div>
                                <button type="button" onClick={() => setEditOpen(!editOpen)} className="chevronButton btn btn-icon-primary align-middle m-1"> <i className="flex-grow-1 fas fa-bars m-1"/></button>
                            </div>
                            <span className={'view-title row align-items-center m-1'}><strong>{view.name}</strong></span>
                        </div>
                    </> :
                    <>
                        <div ref={drag} className="view-parameters d-flex">
                            <span className={'view-title row align-items-center m-1'}><strong>{view.name}</strong></span>
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
