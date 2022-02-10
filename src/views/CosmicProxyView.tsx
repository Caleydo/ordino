// Gets into the phovea.ts
import * as React from 'react';
import {useEffect} from 'react';
import Select from 'react-select';
import {IVisynViewPluginFactory, IVisynViewProps} from 'tdp_core';
import {ICosmicViewPluginParams} from '../visyn/VisynView';

export function CosmicView({
    desc, data, dataDesc, selection, idFilter, parameters, onSelectionChanged, onIdFilterChanged, onParametersChanged
  }: IVisynViewProps<any, ICosmicViewPluginParams>) {

    useEffect(() => {
      if(!parameters) {
        onParametersChanged({currentId: ''});
      }
    }, []);

    console.log(parameters);

    return <iframe className={'w-100 h-100'} src="https://cancer.sanger.ac.uk/cosmic"/>;
}

//Toolbar ?
export function CosmicViewHeader({
    desc, data, dataDesc, selection, idFilter, parameters, onSelectionChanged, onIdFilterChanged, onParametersChanged
  }: IVisynViewProps<any, ICosmicViewPluginParams>) {

    const options = selection.map((s) => {
      return {value: s, label: s};
    });

    return <div style={{width: '200px'}}>
        <Select options={options} onChange={(e) => {
        onParametersChanged({currentId: e.value});
      }}/>
    </div>;
}

export const cosmicConfiguration: () => IVisynViewPluginFactory = () => {
  return {
      view: CosmicView,
      tab: null,
      header: CosmicViewHeader
  };
};
