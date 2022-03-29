// Gets into the phovea.ts
import * as React from 'react';
import { useMemo } from 'react';
import { EColumnTypes, VisSidebar, Vis } from 'tdp_core';
export function VisVisynView({ data, dataDesc, selection, filteredOutIds, parameters, onSelectionChanged }) {
    const filteredData = useMemo(() => {
        let filterData = Object.values(data);
        filterData = filterData.filter((d) => !filteredOutIds.includes(d._visyn_id));
        return filterData;
    }, [data, filteredOutIds]);
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
    return React.createElement(Vis, { columns: cols, selected: selectedMap, selectionCallback: onSelectionChanged, externalConfig: parameters.visConfig, hideSidebar: true });
}
export function VisViewSidebar({ data, dataDesc, selection, filteredOutIds, parameters, onFilteredOutIdsChanged, onParametersChanged, }) {
    const filteredData = useMemo(() => {
        let filterData = Object.values(data);
        filterData = filterData.filter((d) => !filteredOutIds.includes(d._visyn_id));
        return filterData;
    }, [data, filteredOutIds]);
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
            onFilteredOutIdsChanged(selection);
        }
        else if (filterSet === 'Filter In') {
            const allData = Object.values(data);
            const nonSelectedData = allData.filter((d) => !selection.includes(d._visyn_id)).map((d) => d._visyn_id);
            onFilteredOutIdsChanged(nonSelectedData);
        }
        else {
            onFilteredOutIdsChanged([]);
        }
    };
    return (React.createElement(VisSidebar, { columns: finalCols, filterCallback: visFilterChanged, externalConfig: parameters.visConfig, setExternalConfig: (visConfig) => onParametersChanged({ visConfig }), style: { width: '220px' } }));
}
export const visConfiguration = () => {
    return {
        viewType: 'data',
        defaultParameters: {
            visConfig: null,
        },
        view: VisVisynView,
        tab: VisViewSidebar,
        header: null,
    };
};
//# sourceMappingURL=VisVisynView.js.map