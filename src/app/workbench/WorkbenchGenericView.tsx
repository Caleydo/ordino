import * as React from 'react';
import {useMemo, useState} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {EViewChooserMode, useAppDispatch, useAppSelector, ViewChooser} from '../..';
import {IWorkbenchView, removeView, setView} from '../../store';
import {findViewIndex, getAllFilters} from '../../store/storeUtils';
import {colorPalette} from '../Breadcrumb';
import {DropOverlay} from './DropOverlay';
import {EDragTypes} from './utils';
import {useVisynViewPlugin} from './useLoadWorkbenchViewPlugin';
import {IViewPluginDesc} from 'tdp_core';

export interface IWorkbenchGenericViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
    chooserOptions: IViewPluginDesc[];
}

export function WorkbenchGenericView({
    workbenchIndex,
    view,
    chooserOptions
}: IWorkbenchGenericViewProps) {
    const [editOpen, setEditOpen] = useState<boolean>(false);

    const viewPlugin = useVisynViewPlugin(view.id);


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

    console.log(viewPlugin);

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
                            <span className={'view-title row align-items-center m-1'}><strong>{view.id}</strong></span>
                            {viewPlugin && viewPlugin.headerFactory ? <viewPlugin.headerFactory
                                desc={viewPlugin}
                                data={ordino.workbenches[workbenchIndex].data}
                                dataDesc={ordino.workbenches[workbenchIndex].columnDescs}
                                selection={ordino.workbenches[workbenchIndex].selections}
                                filters={getAllFilters(ordino.workbenches[workbenchIndex])}
                                parameters={null}
                                onSelectionChanged={() => console.log('selection changed')}
                                onParametersChanged={() => console.log('param changed')}
                                onFiltersChanged={() => console.log('filter changed')}
                            /> : null}
                        </div>
                    </> :
                    <>
                        <div ref={drag} className="view-parameters d-flex">
                            <span className={'view-title row align-items-center m-1'}><strong>{view.id}</strong></span>
                        </div>
                    </>
                }
                <div className="inner d-flex">
                    {editOpen ? <ViewChooser views={chooserOptions} showBurgerMenu={false} mode={EViewChooserMode.EMBEDDED} onSelectedView={(newView:IViewPluginDesc) => {
                        dispatch(setView({
                            workbenchIndex,
                            viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                            viewId: newView.id
                        }));
                    }} isEmbedded={false}/> : null}
                    {viewPlugin ?
                    <viewPlugin.factory
                        desc={viewPlugin}
                        data={ordino.workbenches[workbenchIndex].data}
                        dataDesc={ordino.workbenches[workbenchIndex].columnDescs}
                        selection={ordino.workbenches[workbenchIndex].selections}
                        filters={getAllFilters(ordino.workbenches[workbenchIndex])}
                        parameters={null}
                        onSelectionChanged={() => console.log('selection changed')}
                        onParametersChanged={() => console.log('param changed')}
                        onFiltersChanged={() => console.log('filter changed')}
                    /> : null}
                </div>

                {isOver && canDrop ? <DropOverlay view={view} /> : null}
            </div>
        </>
    );
}
