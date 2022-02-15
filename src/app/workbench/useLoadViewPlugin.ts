import {values} from 'lodash';
import React from 'react';
import {addTransitionOptions, useAppDispatch, useAppSelector} from '../..';
import {ARankingView, EXTENSION_POINT_TDP_VIEW, FindViewUtils, IDType, IDTypeManager, IView, PluginRegistry, ResolveNow, useAsync} from 'tdp_core';
import {getAllFilters} from '../../store/storeUtils';

export function useLoadViewPlugin(viewId: string, workbenchIndex: number): [(element: HTMLElement | null) => void, IView | null] {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);

    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [instance, setInstance] = React.useState<IView | null>(null);
    const loadView = React.useMemo(() => () => {
        return view.load();
    }, []);

    console.log(ordino.workbenches[workbenchIndex].selectedMappings);

    const {status, value: viewPlugin} = useAsync(loadView, []);

    const setRef = React.useCallback(async (ref: HTMLElement | null) => {
        // Create a new one if there is a ref
        if (ref && status === 'success') {
            console.log(ref);

            ref.innerHTML = '';

            const idType = workbenchIndex === 0 ? 'Start' : ordino.workbenches[workbenchIndex - 1].entityId;

            const inputSelection = {idtype: new IDType(idType, viewId, '', true), ids: workbenchIndex === 0 ? [] : Array.from(ordino.workbenches[workbenchIndex - 1].selection)};

            const selection = {idtype: new IDType(idType, viewId, '', true), ids: Array.from(ordino.workbenches[workbenchIndex].selection)};

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
    }, [status, ordino.workbenches[workbenchIndex].selectedMappings]);

    /**
     * These next 2 use effects are strictly for Ranking Views. TODO:: Where to add this type of view-specific code? OR should every view have a simple way to pass selections/filters?
     */
    React.useEffect(() => {
        console.log(instance, workbenchIndex);
        if(instance && instance instanceof ARankingView) {
            const view: ARankingView = instance;
            const id = IDTypeManager.getInstance().resolveIdType(view.itemIDType.id);

            view.selectionHelper.setGeneralVisSelection({idtype: id, ids: ordino.workbenches[workbenchIndex].selection});
        }
    }, [instance, ordino.workbenches[workbenchIndex].selection]);

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
