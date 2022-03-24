// Gets into the phovea.ts
import * as React from 'react';
import { useMemo } from 'react';
import { VisynDataViewPluginType, EColumnTypes, IVisConfig, VisSidebar, Vis } from 'tdp_core';

type VisViewPluginType = VisynDataViewPluginType<{ visConfig: IVisConfig | null }>;

export function VisVisynView({ data, dataDesc, selection, idFilter, parameters, onSelectionChanged }: VisViewPluginType['props']) {
  const filteredData = useMemo(() => {
    let filterData = Object.values(data) as any[];

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
      values: () =>
        filteredData.map((d) => {
          return { id: d._visyn_id, val: d[c.column] ? d[c.column] : c.type === 'number' ? null : '--' };
        }),
      type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL,
    });
  }

  const selectedMap: { [key: number]: boolean } = {};

  for (const i of filteredData) {
    selectedMap[i._id] = false;
  }

  for (const i of selection) {
    selectedMap[i] = true;
  }

  return <Vis columns={cols} selected={selectedMap} selectionCallback={onSelectionChanged} externalConfig={parameters.visConfig} hideSidebar />;
}

export function VisViewSidebar({ data, dataDesc, selection, idFilter, parameters, onIdFilterChanged, onParametersChanged }: VisViewPluginType['props']) {
  const filteredData = useMemo(() => {
    let filterData = Object.values(data) as any[];

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
        values: () =>
          filteredData.map((d) => {
            return { id: d._visyn_id, val: d[c.column] ? d[c.column] : c.type === 'number' ? null : '--' };
          }),
        type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL,
      });
    }
    return cols;
  }, [dataDesc, filteredData]);

  const visFilterChanged = (filterSet: string) => {
    if (filterSet === 'Filter Out') {
      onIdFilterChanged(selection);
    } else if (filterSet === 'Filter In') {
      const allData = Object.values(data) as any;
      const nonSelectedData = allData.filter((d) => !selection.includes(d._visyn_id)).map((d) => d._visyn_id);
      onIdFilterChanged(nonSelectedData);
    } else {
      onIdFilterChanged([]);
    }
  };

  return (
    <VisSidebar
      columns={finalCols}
      filterCallback={visFilterChanged}
      externalConfig={parameters.visConfig}
      setExternalConfig={(visConfig: IVisConfig) => onParametersChanged({ visConfig })}
      style={{ width: '220px' }}
    />
  );
}

export const visConfiguration: () => VisViewPluginType['definition'] = () => {
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
