import React from 'react';
import {AView, EXTENSION_POINT_TDP_VIEW, IViewPlugin, IViewPluginDesc, LoginMenu, PluginRegistry, useAsync, IView, ObjectRefUtils, ResolveNow, IDType, LocalStorageProvenanceGraphManager, ARankingView, IDTypeManager, FindViewUtils, IDiscoveredView} from 'tdp_core';
import {addTransitionOptions, useAppDispatch, useAppSelector} from '../..';
import {getAllFilters} from '../../store/storeUtils';

export async function useLoadAvailableViews(viewId: string): Promise<IViewPluginDesc[]> {
    const discoveredViews = await FindViewUtils.findAllViews(new IDType(viewId, '.*', '', true));
    return discoveredViews.map((views) => views.v);
}
