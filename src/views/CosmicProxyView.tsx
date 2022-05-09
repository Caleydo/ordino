// Gets into the phovea.ts
import * as React from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
import { VisynSimpleViewPluginType } from 'tdp_core';

type CosmicViewPluginType = VisynSimpleViewPluginType<{ currentId: string }>;

export function CosmicView({ parameters, onParametersChanged }: CosmicViewPluginType['props']) {
  useEffect(() => {
    if (!parameters) {
      onParametersChanged({ currentId: '' });
    }
  });

  return <iframe className="w-100 h-100" src="https://cancer.sanger.ac.uk/cosmic" />;
}

// Toolbar ?
export function CosmicViewHeader({ selection, onParametersChanged }: CosmicViewPluginType['props']) {
  const options = selection.map((s) => {
    return { value: s, label: s };
  });

  return (
    <div className="d-flex align-items-center" style={{ width: '200px' }}>
      <div className="flex-grow-1">
        <Select
          options={options}
          onChange={(e) => {
            onParametersChanged({ currentId: e.value });
          }}
        />
      </div>
    </div>
  );
}

export const cosmicConfiguration: () => CosmicViewPluginType['definition'] = () => {
  return {
    viewType: 'simple',
    defaultParameters: {
      currentId: '',
    },
    view: CosmicView,
    tab: null,
    header: CosmicViewHeader,
  };
};
