import React from 'react';
import { EXTENSION_POINT_TDP_VIEW, PluginRegistry, useAsync, Range, ResolveNow, IDType, IDTypeManager } from 'tdp_core';
import { useAppDispatch, useAppSelector } from '../..';
export function useLoadViewPlugin(viewId) {
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
                const context = { graph: null, ref: { value: { data: null } }, desc: view };
                const selection = { idtype: new IDType('Start', 'Start', '', true), range: Range.none() };
                const i = viewPlugin.factory(context, selection, ref, {});
                console.log(i);
                context.ref[`v`] = i;
                console.log(context.ref);
                ResolveNow.resolveImmediately(i.init(document.querySelector('.view-parameters'), () => null)).then(() => i.setInputSelection(selection));
                return i;
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
    React.useEffect(() => {
        if (instance) {
        }
    }, [instance]);
    return [setRef, instance];
}
//# sourceMappingURL=useLoadViewPlugin.js.map