import React from 'react';
import { EXTENSION_POINT_TDP_VIEW, PluginRegistry, useAsync, Range, ResolveNow, IDType, IDTypeManager, FindViewUtils } from 'tdp_core';
import { addTransitionOptions, useAppDispatch, useAppSelector } from '../..';
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
        setInstance((currentInstance) => {
            // If the element ref did not change, do nothing.
            if (currentInstance && ref) {
                return currentInstance;
            }
            // Create a new one if there is a ref
            if (ref && status === 'success') {
                // TODO: Refactor score in ARanking view to load without tracking
                // at the moment scores do not work
                // dummy context
                const idType = workbenchIndex === 0 ? 'Start' : ordino.workbenches[workbenchIndex - 1].entityId;
                const selection = { idtype: new IDType(idType, '.*', '', true), range: workbenchIndex === 0 ? Range.none() : Range.list(ordino.workbenches[workbenchIndex - 1].selections) };
                console.log(selection.idtype);
                console.log(viewId);
                FindViewUtils.findAllViews(selection.idtype).then((availableViews) => {
                    const context = { graph: null, ref: { value: { data: null } }, desc: workbenchIndex === 0 ? view : availableViews[0].v };
                    console.log(context);
                    const i = viewPlugin.factory(context, selection, ref, {});
                    console.log(i);
                    context.ref[`v`] = i;
                    ResolveNow.resolveImmediately(i.init(document.querySelector('.view-parameters'), () => null)).then(() => i.setInputSelection(selection));
                    return i;
                });
                FindViewUtils.findAllViews(new IDType(viewId, '.*', '', true)).then((availableViews) => {
                    const idTargetSet = new Set();
                    availableViews.forEach((v) => {
                        idTargetSet.add(v.v.itemIDType);
                    });
                    dispatch(addTransitionOptions({ transitionOptions: Array.from(idTargetSet.values()), workbenchIndex }));
                });
            }
            // Set instance to null if no ref is passed
            return null;
        });
    }, [status]);
    React.useEffect(() => {
        if (instance) {
            const view = instance;
            const id = IDTypeManager.getInstance().resolveIdType(view.itemIDType.id);
            view.selectionHelper.setGeneralVisSelection({ idtype: id, range: Range.list(ordino.workbenches[ordino.focusViewIndex].selections) });
        }
    }, [instance, ordino.workbenches[ordino.focusViewIndex].selections]);
    React.useEffect(() => {
        if (instance && ordino.workbenches[ordino.focusViewIndex].filters) {
            const view = instance;
            view.provider.setFilter((row) => {
                return !ordino.workbenches[ordino.focusViewIndex].filters.includes(row.v._id);
            });
        }
    }, [instance, ordino.workbenches[ordino.focusViewIndex].filters]);
    return [setRef, instance];
}
//# sourceMappingURL=useLoadViewPlugin.js.map