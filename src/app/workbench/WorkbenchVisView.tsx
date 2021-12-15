import * as React from 'react';
import {addFilter, addSelection, IWorkbenchView, removeView} from '../../store';
import { Vis } from 'tdp_core';
import {useAppDispatch, useAppSelector} from '../..';
import {EColumnTypes} from '../../../../tdp_core/dist/vis/interfaces';

export interface IWorkbenchVisViewProps {
    view: IWorkbenchView;
}

export function WorkbenchVisView({
    view
}: IWorkbenchVisViewProps) {
    const dispatch = useAppDispatch();

    const ordino = useAppSelector((state) => state.ordino);

    //move stuff into hooks as needed
    const filter = ordino.workbenches[ordino.focusViewIndex].filters;
    let data = Object.values(ordino.workbenches[ordino.focusViewIndex].data);

    if(filter && filter.length > 0) {
        data = data.filter((d, i) => !filter.includes(d._id));
    }

    const colDescriptions = ordino.workbenches[ordino.focusViewIndex].columnDescs;

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

    const selectedMap: { [key: number]: boolean } = {};

    const selections = ordino.workbenches[ordino.focusViewIndex].selections;
    if(selections && selections.length > 0) {

        const allData = ordino.workbenches[ordino.focusViewIndex].data;

        // tslint:disable-next-line:forin
        for(const i in allData) {
            selectedMap[i] = false;
        }

        for(const i of ordino.workbenches[ordino.focusViewIndex].selections) {
            selectedMap[i] = true;
        }
    }

    console.log(selectedMap);


    return (
        <>
            <div className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
                <div className="view-actions">
                    <button type="button" className="btn-close" />
                </div>
                <div className="view-parameters"></div>

                <Vis columns={cols} selected={selectedMap} selectionCallback={(s) => {
                    dispatch(addSelection({newSelection: s}));
                }} filterCallback={(s) => {
                    if(s === 'Filter Out') {
                        dispatch(addFilter({filter: ordino.workbenches[ordino.focusViewIndex].selections}));
                        dispatch(addSelection({newSelection: []}));
                    } else if (s === 'Filter In') {
                        dispatch(addFilter({filter: data.filter((d) => !ordino.workbenches[ordino.focusViewIndex].selections.includes(d._id)).map(d => d._id)}));
                        dispatch(addSelection({newSelection: []}));
                    } else {
                        dispatch(addFilter({filter: []}));
                    }
                }}/>
            </div>
        </>
    );
}
