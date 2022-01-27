// Gets into the phovea.ts
import * as React from 'react';
import {useMemo} from 'react';
import Select from 'react-select';
import {EColumnTypes, Vis} from 'tdp_core';
import {IVisynViewProps} from '../../../tdp_core/dist/views/VisynView';
import {ICosmicViewPluginDesc} from '../visyn/VisynView';

export function CosmicView({
    desc, data, dataDesc, selection, filters, parameters = {currentSelection: ''}, onSelectionChanged, onFiltersChanged, onParametersChanged
  }: IVisynViewProps<ICosmicViewPluginDesc, any>) {

    return <iframe className={'w-100 h-100'} src="https://cancer.sanger.ac.uk/cosmic"/>;
}

export function CosmicViewHeader({
    desc, data, dataDesc, selection, filters, parameters = {
      currentSelection: ''
    }, onSelectionChanged, onFiltersChanged, onParametersChanged
  }: IVisynViewProps<ICosmicViewPluginDesc, any>) {


    const options = selection.map((s) => {
      return {value: s, label: s};
    });

    return <Select options={options} />;
}
