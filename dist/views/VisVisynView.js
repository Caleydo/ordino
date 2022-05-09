// Gets into the phovea.ts
import * as React from 'react';
import { useMemo } from 'react';
import { EColumnTypes, VisSidebar, Vis } from 'tdp_core';
function getFilteredDescColumns(columnDesc, filteredData) {
    const cols = [];
    for (const c of columnDesc.filter((d) => d.type === 'number' || d.type === 'categorical')) {
        cols.push({
            info: {
                name: c.label,
                description: c.summary,
                id: c.column,
            },
            values: () => filteredData.map((d) => {
                return { id: d.id, val: d[c.column] ? d[c.column] : c.type === 'number' ? null : '--' };
            }),
            type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL,
        });
    }
    return cols;
}
export function VisVisynView({ data, columnDesc, selection, filteredOutIds, parameters, onSelectionChanged, onParametersChanged }) {
    const filteredData = useMemo(() => {
        let filterData = Object.values(data);
        filterData = filterData.filter((d) => !filteredOutIds.includes(d.id));
        return filterData;
    }, [data, filteredOutIds]);
    return (React.createElement(Vis, { columns: getFilteredDescColumns(columnDesc, filteredData), selected: selection, selectionCallback: onSelectionChanged, setExternalConfig: (visConfig) => onParametersChanged({ visConfig }), externalConfig: parameters.visConfig, hideSidebar: true }));
}
export function VisViewSidebar({ data, columnDesc, selection, filteredOutIds, parameters, onFilteredOutIdsChanged, onParametersChanged, }) {
    const filteredData = useMemo(() => {
        let filterData = Object.values(data);
        filterData = filterData.filter((d) => !filteredOutIds.includes(d.id));
        return filterData;
    }, [data, filteredOutIds]);
    const finalCols = useMemo(() => {
        return getFilteredDescColumns(columnDesc, filteredData);
    }, [columnDesc, filteredData]);
    const visFilterChanged = (filterSet) => {
        if (filterSet === 'Filter Out') {
            onFilteredOutIdsChanged(selection);
        }
        else if (filterSet === 'Filter In') {
            const allData = Object.values(data);
            const nonSelectedData = allData.filter((d) => !selection.includes(d.id)).map((d) => d.id);
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