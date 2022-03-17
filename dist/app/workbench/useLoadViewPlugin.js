import React from 'react';
import { ARankingView, EXTENSION_POINT_TDP_VIEW, FindViewUtils, IDType, IDTypeManager, PluginRegistry, ResolveNow, useAsync } from 'tdp_core';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addTransitionOptions } from '../../store/ordinoSlice';
import { getAllFilters } from '../../store/storeUtils';
export function useLoadViewPlugin(viewId, workbenchIndex) {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [instance, setInstance] = React.useState(null);
    const loadView = React.useMemo(() => () => {
        return view.load();
    }, 
    // Disabling since this file is nonsense anyways, will be removed when a react Ranking view is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const { status, value: viewPlugin } = useAsync(loadView, []);
    const setRef = React.useCallback(async (ref) => {
        // Create a new one if there is a ref
        if (ref && status === 'success') {
            const idType = workbenchIndex === 0 ? 'Start' : ordino.workbenches[workbenchIndex - 1].entityId;
            const inputSelection = {
                idtype: new IDType(idType, viewId, '', true),
                ids: workbenchIndex === 0 ? [] : Array.from(ordino.workbenches[workbenchIndex - 1].selection),
            };
            const selection = { idtype: new IDType(idType, viewId, '', true), ids: Array.from(ordino.workbenches[workbenchIndex].selection) };
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
                const i = viewPlugin.factory(context, inputSelection, ref, {});
                context.ref.v = i;
                ResolveNow.resolveImmediately(i.init(null, () => null)).then(() => {
                    // i.setInputSelection(inputSelection);
                    // console.log(selection);
                    i.setItemSelection(selection);
                });
                setInstance(i);
            });
        }
    }, 
    // Disabling since this file is nonsense anyways, will be removed when a react Ranking view is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status]);
    /**
     * These next 2 use effects are strictly for Ranking Views. TODO:: Where to add this type of view-specific code? OR should every view have a simple way to pass selections/filters?
     */
    React.useEffect(() => {
        if (instance && instance instanceof ARankingView) {
            const rankingView = instance;
            const id = IDTypeManager.getInstance().resolveIdType(rankingView.itemIDType.id);
            rankingView.selectionHelper.setGeneralVisSelection({ idtype: id, ids: ordino.workbenches[workbenchIndex].selection });
        }
        // Disabling since this file is nonsense anyways, will be removed when a react Ranking view is ready
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instance, ordino.workbenches[workbenchIndex].selection]);
    React.useEffect(() => {
        if (instance && instance instanceof ARankingView) {
            const rankingView = instance;
            const filteredIds = getAllFilters(ordino.workbenches[workbenchIndex]);
            rankingView.provider.setFilter((row) => {
                return !filteredIds.includes(row.v._visyn_id);
            });
        }
        // Disabling since this file is nonsense anyways, will be removed when a react Ranking view is ready
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instance, ordino.workbenches[workbenchIndex].views]);
    return [setRef, instance];
}
//# sourceMappingURL=useLoadViewPlugin.js.map