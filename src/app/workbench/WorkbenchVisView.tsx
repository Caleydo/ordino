import * as React from 'react';
import {addFilter, addSelection, IWorkbenchView, removeView, setWorkbenchDirection} from '../../store';
import { ViewBuilder, Vis } from 'tdp_core';
import {useAppDispatch, useAppSelector} from '../..';
import {EColumnTypes} from '../../../../tdp_core/dist/vis/interfaces';
import {getAllFilters} from '../../store/storeUtils';
import {useMemo} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {EDragTypes} from './utils';
import {DropOverlay} from './DropOverlay';
import {colorPalette} from '../Breadcrumb';

export interface IWorkbenchVisViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}

export function WorkbenchVisView({
    workbenchIndex,
    view
}: IWorkbenchVisViewProps) {
    const dispatch = useAppDispatch();

    const ordino = useAppSelector((state) => state.ordino);

    const [{isOver, canDrop}, drop] = useDrop(() => ({
        accept: [EDragTypes.MOVE],
        canDrop: (d: {type: EDragTypes, viewId: string, index: number}) => {
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

    console.log(view.id, view.index);

    const data = useMemo(() => {
        let data = Object.values(ordino.workbenches[workbenchIndex].data);

        const filteredIds = getAllFilters(ordino.workbenches[workbenchIndex]);

        data = data.filter((d, i) => !filteredIds.includes(d._id));

        return data;
    }, [ordino.workbenches[workbenchIndex].data, ordino.workbenches[workbenchIndex].views]);


    const colDescriptions = ordino.workbenches[workbenchIndex].columnDescs;

    const cols = [];

    for(const c of colDescriptions.filter((d) => d.type === 'number' || d.type === 'categorical')) {
        cols.push({
            info: {
                name: c.label,
                description: c.summary,
                id: c.label + (c)._id
            },
            values: data.map((d, i) => {
                return {id: d._id, val: d[(c).column] ? d[(c).column] : c.type === 'number' ? null : '--'};
            }),
            type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL
        });
    }

    const filterCallback = useMemo(() => (s) => {
        if(s === 'Filter Out') {
            const viewCopy = [...view.filters];
            viewCopy.push(...ordino.workbenches[workbenchIndex].selections);
            dispatch(addFilter({viewId: view.id, filter: viewCopy}));
            dispatch(addSelection({newSelection: []}));
        } else if (s === 'Filter In') {
            const viewCopy = [...view.filters];
            viewCopy.push(...data.filter((d) => !ordino.workbenches[workbenchIndex].selections.includes(d._id)).map((d) => d._id));
            dispatch(addFilter({viewId: view.id, filter: viewCopy}));
            dispatch(addSelection({newSelection: []}));
        } else {
            dispatch(addFilter({viewId: view.id, filter: []}));
        }
    }, [view.filters, ordino.workbenches[workbenchIndex].selections]);

    const selectedMap: { [key: number]: boolean } = {};

    const selections = ordino.workbenches[workbenchIndex].selections;
    if(selections && selections.length > 0) {

        const allData = ordino.workbenches[workbenchIndex].data;

        // tslint:disable-next-line:forin
        for(const i in allData) {
            selectedMap[i] = false;
        }

        for(const i of ordino.workbenches[workbenchIndex].selections) {
            selectedMap[i] = true;
        }
    }

    return (
        <>
            <div ref={drop} className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
                <div className="view-actions">
                    <button onClick={() => dispatch(removeView({workbenchIndex, viewIndex: view.index}))} type="button" className="btn-close" />
                </div>

                <div ref={drag} className="view-parameters d-flex rounded">
                    <div>
                        <button type="button" className="chevronButton btn btn-outline-primary btn-sm align-middle m-1" style={{color: colorPalette[workbenchIndex], borderColor: colorPalette[workbenchIndex]}}> <i className="flex-grow-1 fas fa-chevron-right m-1"/>Edit View</button>
                    </div>
                    <span className={'view-title row align-items-center m-1'}><strong>Vis</strong></span>
                </div>

                <Vis columns={cols} selected={selectedMap} selectionCallback={(s) => {
                    dispatch(addSelection({newSelection: s}));
                }} filterCallback={filterCallback}/>
                {isOver && canDrop ? <DropOverlay view={view} /> : null}
            </div>
        </>
    );
}
