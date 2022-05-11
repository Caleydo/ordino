// Gets into the phovea.ts
import * as React from 'react';
import { useCallback, useMemo } from 'react';
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
          return { id: d.id, val: d[c.column] ? d[c.column] : c.type === 'number' ? null : '--' };
        }),
      type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL,
    });
  }
  return cols;
}

export function VisVisynView({ data, columnDesc, selection, filteredOutIds, parameters, onParametersChanged, onSelectionChanged }: VisViewPluginType['props']) {
  const columns = useMemo(() => {
    let filterData = Object.values(data) as any[];

    const filterSet = new Set(filteredOutIds);

    filterData = filterData.filter((d) => !filterSet.has(d.id));

    return getFilteredDescColumns(columnDesc, filterData);
  }, [data, filteredOutIds, columnDesc]);

  const externalConfigCallback = useCallback((visConfig: IVisConfig) => onParametersChanged({ visConfig }), [onParametersChanged]);

  return (
    <Vis
      columns={columns}
      selected={selection}
      selectionCallback={onSelectionChanged}
      externalConfig={parameters.visConfig}
      setExternalConfig={externalConfigCallback}
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
  const columns = useMemo(() => {
    let filterData = Object.values(data) as any[];

    const filterSet = new Set(filteredOutIds);

    filterData = filterData.filter((d) => !filterSet.has(d.id));

    return getFilteredDescColumns(columnDesc, filterData);
  }, [data, filteredOutIds, columnDesc]);

  const visFilterChanged = (filterSet: string) => {
    if (filterSet === 'Filter Out') {
      onFilteredOutIdsChanged(selection);
    } else if (filterSet === 'Filter In') {
      const allData = Object.values(data) as any;
      const nonSelectedData = allData.filter((d) => !selection.includes(d.id)).map((d) => d.id);
      onFilteredOutIdsChanged(nonSelectedData);
    } else {
      onFilteredOutIdsChanged([]);
    }
  };

  const externalConfigCallback = useCallback((visConfig: IVisConfig) => onParametersChanged({ visConfig }), [onParametersChanged]);

  return (
    <VisSidebar
      columns={columns}
      filterCallback={visFilterChanged}
      externalConfig={parameters.visConfig}
      setExternalConfig={externalConfigCallback}
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
