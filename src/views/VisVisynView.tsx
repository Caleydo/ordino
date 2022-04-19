// Gets into the phovea.ts
import * as React from 'react';
import { useMemo } from 'react';
import { VisynDataViewPluginType, EColumnTypes, IVisConfig, VisSidebar, Vis, VisynViewPluginType } from 'tdp_core';

type VisViewPluginType = VisynDataViewPluginType<{ visConfig: IVisConfig | null }>;

function getFilteredDescColumns(columnDesc: any[] | VisynViewPluginType['desc'], filteredData: any[]): any[] {
  const cols = [];
  for (const c of columnDesc.filter((d) => d.type === 'number' || d.type === 'categorical')) {
    cols.push({
      info: {
        name: c.label,
        description: c.summary,
        id: c.column,
      },
      values: () =>
        filteredData.map((d) => {
          return { id: d._visyn_id, val: d[c.column] ? d[c.column] : c.type === 'number' ? null : '--' };
        }),
      type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL,
    });
  }
  return cols;
}

export function VisVisynView({ data, columnDesc, selection, filteredOutIds, parameters, onParametersChanged, onSelectionChanged }: VisViewPluginType['props']) {
  const filteredData = useMemo(() => {
    let filterData = Object.values(data) as any[];

    filterData = filterData.filter((d) => !filteredOutIds.includes(d._visyn_id));

    return filterData;
  }, [data, filteredOutIds]);

  return (
    <Vis
      columns={getFilteredDescColumns(columnDesc, filteredData)}
      selected={selection}
      selectionCallback={onSelectionChanged}
      externalConfig={parameters.visConfig}
      setExternalConfig={(visConfig: IVisConfig) => onParametersChanged({ visConfig })}
      hideSidebar
    />
  );
}

export function VisViewSidebar({
  data,
  columnDesc,
  selection,
  filteredOutIds,
  parameters,
  onFilteredOutIdsChanged,
  onParametersChanged,
}: VisViewPluginType['props']) {
  const filteredData = useMemo(() => {
    let filterData = Object.values(data) as any[];

    filterData = filterData.filter((d) => !filteredOutIds.includes(d._visyn_id));

    return filterData;
  }, [data, filteredOutIds]);

  const finalCols = useMemo(() => {
    return getFilteredDescColumns(columnDesc, filteredData);
  }, [columnDesc, filteredData]);

  const visFilterChanged = (filterSet: string) => {
    if (filterSet === 'Filter Out') {
      onFilteredOutIdsChanged(selection);
    } else if (filterSet === 'Filter In') {
      const allData = Object.values(data) as any;
      const nonSelectedData = allData.filter((d) => !selection.includes(d._visyn_id)).map((d) => d._visyn_id);
      onFilteredOutIdsChanged(nonSelectedData);
    } else {
      onFilteredOutIdsChanged([]);
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
