import * as React from 'react';
import {IWorkbenchView, removeView} from '../../store';
import { Vis } from 'tdp_core';
import {useAppSelector} from '../..';
import {EColumnTypes} from '../../../../tdp_core/dist/vis/interfaces';
import {dispatch} from 'd3';



export interface IWorkbenchVisViewProps {
    view: IWorkbenchView;
}

export function WorkbenchVisView({
    view
}: IWorkbenchVisViewProps) {

    const ordino = useAppSelector((state) => state.ordino);

    const data = Object.values(ordino.workbenches[ordino.focusViewIndex].data);
    const colDescriptions = ordino.workbenches[ordino.focusViewIndex].columnDescs;

    console.log(data);

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

    return (
        <>
            <div className="position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1">
                <div className="view-actions">
                    <button type="button" className="btn-close" />
                </div>
                <div className="view-parameters"></div>

                <Vis columns={cols}/>
            </div>
        </>
    );
}
