import React from 'react';
import { EXTENSION_POINT_TDP_VIEW, PluginRegistry, useAsync, Range, ResolveNow, IDType, IDTypeManager, FindViewUtils } from 'tdp_core';
import { addTransitionOptions, useAppDispatch, useAppSelector } from '../..';
import { getAllFilters } from '../../store/storeUtils';
export function useLoadViewPlugin(viewId, workbenchIndex) {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [instance, setInstance] = React.useState(null);
    console.log(view);
    const loadView = React.useMemo(() => () => {
        return view.load();
    }, []);
    const { status, value: viewPlugin } = useAsync(loadView, []);
    const setRef = React.useCallback(async (ref) => {
        // Create a new one if there is a ref
        if (ref && status === 'success') {
            const idType = workbenchIndex === 0 ? 'Start' : ordino.workbenches[workbenchIndex - 1].entityId;
            const selection = { idtype: new IDType(idType, viewId, '', true), range: workbenchIndex === 0 ? Range.none() : Range.list(ordino.workbenches[workbenchIndex - 1].selections) };
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
                ResolveNow.resolveImmediately(i.init(document.querySelector('.view-parameters'), () => null)).then(() => i.setInputSelection(selection));
                setInstance(i);
            });
        }
    }, [status]);
    React.useEffect(() => {
        if (instance) {
            const view = instance;
            const id = IDTypeManager.getInstance().resolveIdType(view.itemIDType.id);
            view.selectionHelper.setGeneralVisSelection({ idtype: id, range: Range.list(ordino.workbenches[workbenchIndex].selections) });
        }
    }, [instance, ordino.workbenches[workbenchIndex].selections]);
    React.useEffect(() => {
        if (instance) {
            const view = instance;
            const filteredIds = getAllFilters(ordino.workbenches[workbenchIndex]);
            view.provider.setFilter((row) => {
                return !filteredIds.includes(row.v._id);
            });
        }
    }, [instance, ordino.workbenches[workbenchIndex].views]);
    return [setRef, instance];
}
//# sourceMappingURL=useLoadViewPlugin.js.map