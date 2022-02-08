import React from 'react';
import { EXTENSION_POINT_TDP_VIEW, PluginRegistry, useAsync, ResolveNow, IDType, ARankingView, IDTypeManager, FindViewUtils } from 'tdp_core';
import { addTransitionOptions, useAppDispatch, useAppSelector } from '../..';
import { getAllFilters } from '../../store/storeUtils';
export function useLoadViewPlugin(viewId, workbenchIndex) {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [instance, setInstance] = React.useState(null);
    const loadView = React.useMemo(() => () => {
        return view.load();
    }, []);
    const { status, value: viewPlugin } = useAsync(loadView, []);
    const setRef = React.useCallback(async (ref) => {
        // Create a new one if there is a ref
        if (ref && status === 'success') {
            const idType = workbenchIndex === 0 ? 'Start' : ordino.workbenches[workbenchIndex - 1].entityId;
            const selection = { idtype: new IDType(idType, viewId, '', true), ids: workbenchIndex === 0 ? [] : ordino.workbenches[workbenchIndex - 1].selectionIds };
            FindViewUtils.findAllViews(new IDType(viewId, '.*', '', true)).then((availableViews) => {
                const idTargetSet = new Set();
                availableViews.forEach((v) => {
                    idTargetSet.add(v.v.itemIDType);
                });
                dispatch(addTransitionOptions({ transitionOptions: Array.from(idTargetSet.values()), workbenchIndex }));
            });
            FindViewUtils.findAllViews(selection.idtype).then((availableViews) => {
                const filteredViews = availableViews.filter((v) => viewId.endsWith(v.v.itemIDType));
                const context = { graph: null, ref: { value: { data: null } }, desc: workbenchIndex === 0 ? view : filteredViews[0].v };
                const i = viewPlugin.factory(context, selection, ref, {});
                context.ref[`v`] = i;
                ResolveNow.resolveImmediately(i.init(document.getElementById(viewId).querySelector('.view-parameters'), () => null)).then(() => i.setInputSelection(selection));
                setInstance(i);
            });
        }
    }, [status]);
    /**
     * These next 2 use effects are strictly for Ranking Views. TODO:: Where to add this type of view-specific code? OR should every view have a simple way to pass selections/filters?
     */
    React.useEffect(() => {
        if (instance && instance instanceof ARankingView) {
            const view = instance;
            const id = IDTypeManager.getInstance().resolveIdType(view.itemIDType.id);
            view.selectionHelper.setGeneralVisSelection({ idtype: id, ids: ordino.workbenches[workbenchIndex].selectionIds });
        }
    }, [instance, ordino.workbenches[workbenchIndex].selectionIds]);
    React.useEffect(() => {
        if (instance && instance instanceof ARankingView) {
            const view = instance;
            const filteredIds = getAllFilters(ordino.workbenches[workbenchIndex]);
            view.provider.setFilter((row) => {
                return !filteredIds.includes(row.v._visyn_id);
            });
        }
    }, [instance, ordino.workbenches[workbenchIndex].views]);
    return [setRef, instance];
}
//# sourceMappingURL=useLoadViewPlugin.js.map