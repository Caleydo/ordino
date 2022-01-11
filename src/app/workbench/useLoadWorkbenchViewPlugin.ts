import React, {useEffect} from 'react';
import {AView, EXTENSION_POINT_TDP_VIEW, IViewPlugin, IViewPluginDesc, LoginMenu, PluginRegistry, useAsync, Range, IView, ObjectRefUtils, ResolveNow, IDType, LocalStorageProvenanceGraphManager, ARankingView, IDTypeManager, FindViewUtils, IDiscoveredView} from 'tdp_core';
import {addTransitionOptions, useAppDispatch, useAppSelector} from '../..';
import {getAllFilters} from '../../store/storeUtils';
import {useLoadAvailableViews} from './useLoadAvailableViews';

export function useLoadWorkbenchViewPlugin(viewId: string, workbenchIndex: number): [(element: HTMLElement | null) => void, IView | null] {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId) as IViewPluginDesc;
    const contextView = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, view.idtype) as IViewPluginDesc;

    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [instance, setInstance] = React.useState<IView | null>(null);
    const loadView = React.useMemo(() => () => {
        return view.load();
    }, []);

    const {status, value: viewPlugin} = useAsync(loadView, []);

    const setRef = React.useCallback(async (ref: HTMLElement | null) => {
        // Create a new one if there is a ref
        if (ref && status === 'success') {
            const idType = new IDType(ordino.workbenches[workbenchIndex].entityId, viewId, '', true);

            idType.fillMapCache(Object.values(ordino.workbenches[workbenchIndex].data).map((v) => v._id), Object.values(ordino.workbenches[workbenchIndex].data).map((v) => v.celllinename));

            const selection = {idtype: idType, range: Range.list(ordino.workbenches[workbenchIndex].selections)};

            console.log(contextView);
            console.log(view);
            console.log(selection);

            const context = {graph: null, ref: {value: {data: null}} as any, desc: contextView};

            const i = viewPlugin.factory(context, selection, ref, {});
            context.ref[`v`] = i;

            ResolveNow.resolveImmediately(i.init(document.getElementById(viewId).querySelector('.view-parameters'), () => null)).then(() => i.setInputSelection(selection));
            setInstance(i);
        }
    }, [status]);

    return [setRef, instance];
}
