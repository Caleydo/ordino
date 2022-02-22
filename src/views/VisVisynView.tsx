// Gets into the phovea.ts
import * as React from 'react';
import {useMemo} from 'react';
import {IVisynViewPluginFactory} from 'tdp_core';
import {EColumnTypes, IVisConfig, IVisynViewProps, VisSidebar, Vis} from 'tdp_core';

export function VisVisynView({
    desc, data, dataDesc, selection, idFilter, parameters, onSelectionChanged, onIdFilterChanged, onParametersChanged
  }: IVisynViewProps<any, IVisConfig>) {


    const filteredData = useMemo(() => {
        let filterData = Object.values(data);

        filterData = filterData.filter((d, i) => !idFilter.includes(d._visyn_id));

        return filterData;
    }, [data, idFilter]);

    const cols = [];

    for(const c of dataDesc.filter((d) => d.type === 'number' || d.type === 'categorical')) {
        cols.push({
            info: {
                name: c.label,
                description: c.summary,
                id: c.label + (c)._id
            },
            values: () => filteredData.map((d, i) => {
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

    return <Vis columns={cols} selected={selectedMap} selectionCallback={onSelectionChanged} externalConfig={parameters} hideSidebar={true}/>;
}

export function VisViewSidebar({
    desc, data, dataDesc, selection, idFilter, parameters, onSelectionChanged, onIdFilterChanged, onParametersChanged
  }: IVisynViewProps<any, IVisConfig>) {


    const filteredData = useMemo(() => {
        let filterData = Object.values(data);

        filterData = filterData.filter((d, i) => !idFilter.includes(d._visyn_id));

        return filterData;
    }, [data, idFilter]);

    const cols = useMemo(() => {
        const cols = [];

        for(const c of dataDesc.filter((d) => d.type === 'number' || d.type === 'categorical')) {
            cols.push({
                info: {
                    name: c.label,
                    description: c.summary,
                    id: c.label + (c)._id
                },
                values: () => filteredData.map((d, i) => {
                    return {id: d._visyn_id, val: d[(c).column] ? d[(c).column] : c.type === 'number' ? null : '--'};
                }),
                type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL
            });
        }
        return cols;
    }, [data, dataDesc, idFilter]);

    const visFilterChanged = (filterSet: string) => {
        if(filterSet === 'Filter Out') {
            onIdFilterChanged(selection);
        } else if(filterSet === 'Filter In') {
            const allData = Object.values(data);
            const nonSelectedData = allData.filter((d) => !selection.includes(d._visyn_id)).map((d) => d._visyn_id);
            onIdFilterChanged(nonSelectedData);
        } else {
            onIdFilterChanged([]);
        }
    };

    console.log(cols, parameters);

    return <VisSidebar width={'220px'} columns={cols} filterCallback={visFilterChanged} externalConfig={parameters} setExternalConfig={onParametersChanged}/>;
}

export const visConfiguration: () => IVisynViewPluginFactory = () => {
    return {
        view: VisVisynView,
        tab: VisViewSidebar,
        header: null
    };
};
