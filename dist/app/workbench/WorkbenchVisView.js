import * as React from 'react';
import { addFilter, addSelection } from '../../store';
import { Vis } from 'tdp_core';
import { useAppDispatch, useAppSelector } from '../..';
import { EColumnTypes } from '../../../../tdp_core/dist/vis/interfaces';
import { getAllFilters } from '../../store/storeUtils';
import { useMemo } from 'react';
export function WorkbenchVisView({ workbenchIndex, view }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const data = useMemo(() => {
        let data = Object.values(ordino.workbenches[workbenchIndex].data);
        const filteredIds = getAllFilters(ordino.workbenches[workbenchIndex]);
        console.log(ordino);
        data = data.filter((d, i) => !filteredIds.includes(d._id));
        console.log('in here');
        return data;
    }, [ordino.workbenches[workbenchIndex].data, ordino.workbenches[workbenchIndex].views]);
    const colDescriptions = ordino.workbenches[workbenchIndex].columnDescs;
    const cols = [];
    for (const c of colDescriptions.filter((d) => d.type === 'number' || d.type === 'categorical')) {
        cols.push({
            info: {
                name: c.label,
                description: c.summary,
                id: c.label + (c)._id
            },
            values: data.map((d, i) => {
                return { id: d._id, val: d[(c).column] ? d[(c).column] : c.type === 'number' ? null : '--' };
            }),
            type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL
        });
    }
    console.log(view);
    console.log(ordino);
    const filterCallback = useMemo(() => (s) => {
        if (s === 'Filter Out') {
            const viewCopy = [...view.filters];
            console.log(viewCopy, view.filters);
            viewCopy.push(...ordino.workbenches[workbenchIndex].selections);
            console.log(viewCopy);
            dispatch(addFilter({ viewId: view.id, filter: viewCopy }));
            dispatch(addSelection({ newSelection: [] }));
        }
        else if (s === 'Filter In') {
            const viewCopy = [...view.filters];
            viewCopy.push(...data.filter((d) => !ordino.workbenches[workbenchIndex].selections.includes(d._id)).map((d) => d._id));
            dispatch(addFilter({ viewId: view.id, filter: viewCopy }));
            dispatch(addSelection({ newSelection: [] }));
        }
        else {
            dispatch(addFilter({ viewId: view.id, filter: [] }));
        }
    }, [view.filters, ordino.workbenches[workbenchIndex].selections]);
    const selectedMap = {};
    const selections = ordino.workbenches[workbenchIndex].selections;
    if (selections && selections.length > 0) {
        const allData = ordino.workbenches[workbenchIndex].data;
        // tslint:disable-next-line:forin
        for (const i in allData) {
            selectedMap[i] = false;
        }
        for (const i of ordino.workbenches[workbenchIndex].selections) {
            selectedMap[i] = true;
        }
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" },
            React.createElement("div", { className: "view-actions" },
                React.createElement("button", { type: "button", className: "btn-close" })),
            React.createElement("div", { className: "view-parameters" }),
            React.createElement(Vis, { columns: cols, selected: selectedMap, selectionCallback: (s) => {
                    dispatch(addSelection({ newSelection: s }));
                }, filterCallback: filterCallback }))));
}
//# sourceMappingURL=WorkbenchVisView.js.map