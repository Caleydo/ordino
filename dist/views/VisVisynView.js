// Gets into the phovea.ts
import * as React from 'react';
import { useCallback, useMemo } from 'react';
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
export function VisVisynView({ data, columnDesc, selection, filteredOutIds, parameters, onParametersChanged, onSelectionChanged }) {
    const columns = useMemo(() => {
        let filterData = Object.values(data);
        filterData = filterData.filter((d) => !filteredOutIds.includes(d.id));
        return getFilteredDescColumns(columnDesc, filterData);
    }, [data, filteredOutIds, columnDesc]);
    const externalConfigCallback = useCallback((visConfig) => onParametersChanged({ visConfig }), [onParametersChanged]);
    return (React.createElement(Vis, { columns: columns, selected: selection, selectionCallback: onSelectionChanged, externalConfig: parameters.visConfig, setExternalConfig: externalConfigCallback, hideSidebar: true }));
}
export function VisViewSidebar({ data, columnDesc, selection, filteredOutIds, parameters, onFilteredOutIdsChanged, onParametersChanged, }) {
    const columns = useMemo(() => {
        let filterData = Object.values(data);
        filterData = filterData.filter((d) => !filteredOutIds.includes(d.id));
        return getFilteredDescColumns(columnDesc, filterData);
    }, [data, filteredOutIds, columnDesc]);
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
    const externalConfigCallback = useCallback((visConfig) => onParametersChanged({ visConfig }), [onParametersChanged]);
    return (React.createElement(VisSidebar, { columns: columns, filterCallback: visFilterChanged, externalConfig: parameters.visConfig, setExternalConfig: externalConfigCallback, style: { width: '220px' } }));
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