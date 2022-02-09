import {values} from 'lodash';
import React from 'react';
import {AView, EXTENSION_POINT_TDP_VIEW, IViewPlugin, IViewPluginDesc, PluginRegistry, useAsync, IView, ObjectRefUtils, ResolveNow, IDType, LocalStorageProvenanceGraphManager, ARankingView, IDTypeManager, FindViewUtils, IDiscoveredView} from 'tdp_core';
import {addTransitionOptions, useAppDispatch, useAppSelector} from '../..';
import {getAllFilters} from '../../store/storeUtils';
import {useLoadAvailableViews} from './useLoadAvailableViews';

export function useLoadViewPlugin(viewId: string, workbenchIndex: number): [(element: HTMLElement | null) => void, IView | null] {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId) as IViewPluginDesc;

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

            const idType = workbenchIndex === 0 ? 'Start' : ordino.workbenches[workbenchIndex - 1].entityId;

            const inputSelection = {idtype: new IDType(idType, viewId, '', true), selectionIds: workbenchIndex === 0 ? [] : Array.from(ordino.workbenches[workbenchIndex - 1].selectionIds)};

            const selection = {idtype: new IDType(idType, viewId, '', true), selectionIds: Array.from(ordino.workbenches[workbenchIndex].selectionIds)};

            FindViewUtils.findAllViews(new IDType(viewId, '.*', '', true)).then((availableViews) => {
                const idTargetSet = new Set<string>();

                availableViews.forEach((v) => {
                    idTargetSet.add(v.v.itemIDType);
                });

                dispatch(addTransitionOptions({transitionOptions: Array.from(idTargetSet.values()), workbenchIndex}));
            });

            FindViewUtils.findAllViews(selection.idtype).then((availableViews) => {
                const filteredViews = availableViews.filter((v) => viewId.endsWith(v.v.itemIDType));

                const context = {graph: null, ref: {value: {data: null}} as any, desc: workbenchIndex === 0 ? view : filteredViews[0].v};

                const i = viewPlugin.factory(context, inputSelection, ref, {});
                context.ref[`v`] = i;

                ResolveNow.resolveImmediately(i.init(null, () => null)).then(() => {
                    // i.setInputSelection(inputSelection);
                    // console.log(selection);
                    i.setItemSelection(selection);
                });
                setInstance(i);
            });
        }
    }, [status]);

    /**
     * These next 2 use effects are strictly for Ranking Views. TODO:: Where to add this type of view-specific code? OR should every view have a simple way to pass selections/filters?
     */
    React.useEffect(() => {
        console.log(instance, workbenchIndex);
        if(instance && instance instanceof ARankingView) {
            const view: ARankingView = instance;
            const id = IDTypeManager.getInstance().resolveIdType(view.itemIDType.id);

            console.log('setting shit in here', ordino.workbenches[workbenchIndex].selectionIds);

            view.selectionHelper.setGeneralVisSelection({idtype: id, selectionIds: ordino.workbenches[workbenchIndex].selectionIds});

        }
    }, [instance, ordino.workbenches[workbenchIndex].selectionIds]);

    React.useEffect(() => {
        if(instance && instance instanceof ARankingView) {
            const view: ARankingView = instance;
            const filteredIds = getAllFilters(ordino.workbenches[workbenchIndex]);

            view.provider.setFilter((row) => {
                return !filteredIds.includes(row.v._visyn_id);
            });
        }
    }, [instance, ordino.workbenches[workbenchIndex].views]);

    return [setRef, instance];
}
