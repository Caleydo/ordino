import React from 'react';
import {AView, EXTENSION_POINT_TDP_VIEW, IViewPlugin, IViewPluginDesc, LoginMenu, PluginRegistry, useAsync, IView, ObjectRefUtils, ResolveNow, IDType, LocalStorageProvenanceGraphManager, ARankingView, IDTypeManager, FindViewUtils, IDiscoveredView, ISelection} from 'tdp_core';
import {addTransitionOptions, useAppDispatch, useAppSelector} from '../..';
import {getAllFilters} from '../../store/storeUtils';


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

            const selection: ISelection = {idtype: new IDType(idType, viewId, '', true), ids: workbenchIndex === 0 ? [] : ordino.workbenches[workbenchIndex - 1].selectionIds};


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

                const i = viewPlugin.factory(context, selection, ref, {});
                context.ref[`v`] = i;

                console.log('#' + viewId);

                ResolveNow.resolveImmediately(i.init(document.getElementById(viewId).querySelector('.view-parameters'), () => null)).then(() => i.setInputSelection(selection));
                setInstance(i);
            });
        }
    }, [status]);

    React.useEffect(() => {
        if(instance) {
            const view: ARankingView = instance as unknown as ARankingView;
            const id = IDTypeManager.getInstance().resolveIdType(view.itemIDType.id);

            view.selectionHelper.setGeneralVisSelection({idtype: id, ids: ordino.workbenches[workbenchIndex].selectionIds});

        }
    }, [instance, ordino.workbenches[workbenchIndex].selectionIds]);

    React.useEffect(() => {
        if(instance) {
            const view: ARankingView = instance as unknown as ARankingView;
            const filteredIds = getAllFilters(ordino.workbenches[workbenchIndex]);

            view.provider.setFilter((row) => {
                return !filteredIds.includes(row.v._visyn_id);
            });
        }
    }, [instance, ordino.workbenches[workbenchIndex].views]);

    return [setRef, instance];
}
