// Gets into the phovea.ts
import * as React from 'react';
import { useMemo } from 'react';
import { EColumnTypes, VisSidebar, Vis } from 'tdp_core';
export function VisVisynView({ data, dataDesc, selection, idFilter, parameters, onSelectionChanged }) {
    const filteredData = useMemo(() => {
        let filterData = Object.values(data);
        filterData = filterData.filter((d) => !idFilter.includes(d._visyn_id));
        return filterData;
    }, [data, idFilter]);
    const cols = [];
    for (const c of dataDesc.filter((d) => d.type === 'number' || d.type === 'categorical')) {
        cols.push({
            info: {
                name: c.label,
                description: c.summary,
                id: c.label + c._id,
            },
            values: () => filteredData.map((d) => {
                return { id: d._visyn_id, val: d[c.column] ? d[c.column] : c.type === 'number' ? null : '--' };
            }),
            type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL,
        });
    }
    const selectedMap = {};
    for (const i of filteredData) {
        selectedMap[i._id] = false;
    }
    for (const i of selection) {
        selectedMap[i] = true;
    }
    return React.createElement(Vis, { columns: cols, selected: selectedMap, selectionCallback: onSelectionChanged, externalConfig: parameters, hideSidebar: true });
}
export function VisViewSidebar({ data, dataDesc, selection, idFilter, parameters, onIdFilterChanged, onParametersChanged }) {
    const filteredData = useMemo(() => {
        let filterData = Object.values(data);
        filterData = filterData.filter((d) => !idFilter.includes(d._visyn_id));
        return filterData;
    }, [data, idFilter]);
    const finalCols = useMemo(() => {
        const cols = [];
        for (const c of dataDesc.filter((d) => d.type === 'number' || d.type === 'categorical')) {
            cols.push({
                info: {
                    name: c.label,
                    description: c.summary,
                    id: c.label + c._id,
                },
                values: () => filteredData.map((d) => {
                    return { id: d._visyn_id, val: d[c.column] ? d[c.column] : c.type === 'number' ? null : '--' };
                }),
                type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL,
            });
        }
        return cols;
    }, [dataDesc, filteredData]);
    const visFilterChanged = (filterSet) => {
        if (filterSet === 'Filter Out') {
            onIdFilterChanged(selection);
        }
        else if (filterSet === 'Filter In') {
            const allData = Object.values(data);
            const nonSelectedData = allData.filter((d) => !selection.includes(d._visyn_id)).map((d) => d._visyn_id);
            onIdFilterChanged(nonSelectedData);
        }
        else {
            onIdFilterChanged([]);
        }
    };
    return React.createElement(VisSidebar, { width: "220px", columns: finalCols, filterCallback: visFilterChanged, externalConfig: parameters, setExternalConfig: onParametersChanged });
}
export const visConfiguration = () => {
    return {
        view: VisVisynView,
        tab: VisViewSidebar,
        header: null,
    };
};
//# sourceMappingURL=VisVisynView.js.map