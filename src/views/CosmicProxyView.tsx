// Gets into the phovea.ts
import * as React from 'react';
import {useMemo} from 'react';
import {EColumnTypes, Vis} from 'tdp_core';
import {IVisynViewProps} from '../visyn/VisynView';

export function CosmicView({
    desc, data, dataDesc, selection, filters, parameters = {
      currentVisType: 'scatterplot'
    }, onSelectionChanged, onFiltersChanged, onParametersChanged
  }: IVisynViewProps<any, any>) {

    return <iframe className={'w-100 h-100'} src="https://cancer.sanger.ac.uk/cosmic"/>;
  }

export function CosmicViewHeader({
    desc, data, dataDesc, selection, filters, parameters = {
      currentVisType: 'scatterplot'
    }, onSelectionChanged, onFiltersChanged, onParametersChanged
  }: IVisynViewProps<any, any>) {

    return <p className={'row align-items-center m-1'}>Hello there</p>;
}
