import * as React from 'react';
import {useMemo, useState} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {EViewChooserMode, useAppDispatch, useAppSelector, ViewChooser} from '../..';
import {removeView, setView} from '../../store';
import {findViewIndex, getAllFilters} from '../../store/storeUtils';
import {DropOverlay} from './DropOverlay';
import {EDragTypes} from './utils';
import {IViewPluginDesc} from 'tdp_core';
import { IWorkbenchGenericViewProps } from '.';


export function WorkbenchEmptyView({
    workbenchIndex,
    view,
    chooserOptions
}: IWorkbenchGenericViewProps) {
    const [editOpen, setEditOpen] = useState<boolean>(false);



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
                                {/* <button type="button" onClick={() => setEditOpen(!editOpen)} className="chevronButton btn btn-icon-primary align-middle m-1"> <i className="flex-grow-1 fas fa-bars m-1"/></button> */}
                            </div>
                        </div>
                    </> :
                    <>
                        <div ref={drag} className="view-parameters d-flex">
                        </div>
                    </>
                }
                <div className="inner d-flex">
                    <ViewChooser views={chooserOptions} showBurgerMenu={false} mode={EViewChooserMode.EMBEDDED} onSelectedView={(newView:IViewPluginDesc) => {
                        dispatch(setView({
                            workbenchIndex,
                            viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                            viewId: newView.id
                        }));
                    }} isEmbedded={false}/>
                    <div className="w-100 d-flex justify-content-center align-items-center">
                        <p className="emptyViewText">Select A View</p>
                    </div>
                </div>

                {isOver && canDrop ? <DropOverlay view={view} /> : null}
            </div>
        </>
    );
}
