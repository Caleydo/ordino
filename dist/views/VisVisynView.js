// Gets into the phovea.ts
import * as React from 'react';
import { useMemo } from 'react';
import { EColumnTypes, Vis } from 'tdp_core';
export function VisVisynView({ desc, data, dataDesc, selection, filters, parameters = {
    currentVisType: 'scatterplot'
}, onSelectionChanged, onFiltersChanged, onParametersChanged }) {
    const filteredData = useMemo(() => {
        let filterData = Object.values(data);
        filterData = filterData.filter((d, i) => !filters.includes(d._id));
        return filterData;
    }, [data, filters]);
    const cols = [];
    for (const c of dataDesc.filter((d) => d.type === 'number' || d.type === 'categorical')) {
        cols.push({
            info: {
                name: c.label,
                description: c.summary,
                id: c.label + (c)._id
            },
            values: filteredData.map((d, i) => {
                return { id: d._id, val: d[(c).column] ? d[(c).column] : c.type === 'number' ? null : '--' };
            }),
            type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL
        });
    }
    const selectedMap = {};
    for (const i of filteredData) {
        selectedMap[i._id] = false;
    }
    for (const i of selection) {
        selectedMap[i] = true;
    }
    return React.createElement(Vis, { columns: cols, selected: selectedMap, filterCallback: onFiltersChanged, selectionCallback: onSelectionChanged });
}
//# sourceMappingURL=VisVisynView.js.map