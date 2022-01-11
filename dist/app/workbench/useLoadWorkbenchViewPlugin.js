import React from 'react';
import { EXTENSION_POINT_TDP_VIEW, PluginRegistry, useAsync, Range, ResolveNow, IDType } from 'tdp_core';
import { useAppDispatch, useAppSelector } from '../..';
export function useLoadWorkbenchViewPlugin(viewId, workbenchIndex) {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
    const contextView = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, view.idtype);
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
            const idType = new IDType(ordino.workbenches[workbenchIndex].entityId, viewId, '', true);
            idType.fillMapCache(Object.values(ordino.workbenches[workbenchIndex].data).map((v) => v._id), Object.values(ordino.workbenches[workbenchIndex].data).map((v) => v.celllinename));
            const selection = { idtype: idType, range: Range.list(ordino.workbenches[workbenchIndex].selections) };
            console.log(contextView);
            console.log(view);
            console.log(selection);
            const context = { graph: null, ref: { value: { data: null } }, desc: contextView };
            const i = viewPlugin.factory(context, selection, ref, {});
            context.ref[`v`] = i;
            ResolveNow.resolveImmediately(i.init(document.getElementById(viewId).querySelector('.view-parameters'), () => null)).then(() => i.setInputSelection(selection));
            setInstance(i);
        }
    }, [status]);
    return [setRef, instance];
}
//# sourceMappingURL=useLoadWorkbenchViewPlugin.js.map