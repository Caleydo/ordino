// Gets into the phovea.ts
import {param} from 'jquery';
import * as React from 'react';
import {useEffect, useMemo} from 'react';
import {EColumnTypes, ESupportedPlotlyVis, IVisConfig, IVisynViewProps, VisSidebar, Vis} from 'tdp_core';

export function VisVisynView({
    desc, data, dataDesc, selection, filters, parameters, onSelectionChanged, onFiltersChanged, onParametersChanged
  }: IVisynViewProps<any, IVisConfig>) {

    const filteredData = useMemo(() => {
        let filterData = Object.values(data);

        filterData = filterData.filter((d, i) => !filters.includes(d._visyn_id));

        return filterData;
    }, [data, filters]);

    const cols = [];

    for(const c of dataDesc.filter((d) => d.type === 'number' || d.type === 'categorical')) {
        cols.push({
            info: {
                name: c.label,
                description: c.summary,
                id: c.label + (c)._id
            },
            values: filteredData.map((d, i) => {
                return {id: d._visyn_id, val: d[(c).column] ? d[(c).column] : c.type === 'number' ? null : '--'};
            }),
            type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL
        });
    }

    const selectedMap: { [key: number]: boolean } = {};

    for(const i of filteredData) {
        selectedMap[i._id] = false;
    }

    for(const i of selection) {
        selectedMap[i] = true;
    }

    return <Vis columns={cols} selected={selectedMap} filterCallback={(f: string) => console.log('filter')} selectionCallback={onSelectionChanged} externalConfig={parameters} hideSidebar={true}/>;
}

export function VisViewSidebar({
    desc, data, dataDesc, selection, filters, parameters, onSelectionChanged, onFiltersChanged, onParametersChanged
  }: IVisynViewProps<any, IVisConfig>) {

    const filteredData = useMemo(() => {
        let filterData = Object.values(data);

        filterData = filterData.filter((d, i) => !filters.includes(d._visyn_id));

        return filterData;
    }, [data, filters]);

    const cols = useMemo(() => {
        const cols = [];

        for(const c of dataDesc.filter((d) => d.type === 'number' || d.type === 'categorical')) {
            cols.push({
                info: {
                    name: c.label,
                    description: c.summary,
                    id: c.label + (c)._id
                },
                values: filteredData.map((d, i) => {
                    return {id: d._visyn_id, val: d[(c).column] ? d[(c).column] : c.type === 'number' ? null : '--'};
                }),
                type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL
            });
        }
        return cols;
    }, [data, dataDesc, filters]);


    return <VisSidebar width={'220px'} columns={cols} externalConfig={parameters} setExternalConfig={onParametersChanged}/>;
}
