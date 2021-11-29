import React from "react";
import { EXTENSION_POINT_TDP_VIEW, PluginRegistry, useAsync, Range, ResolveNow, IDType } from "tdp_core";
import { useAppDispatch } from "../..";
export function useLoadViewPlugin(viewId) {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
    const dispatch = useAppDispatch();
    const [instance, setInstance] = React.useState(null);
    console.log(view);
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
                const context = { graph: null, ref: null, desc: view };
                const selection = { idtype: new IDType('Start', 'Start', '', true), range: Range.none() };
                const i = viewPlugin.factory(context, selection, ref, {});
                ref.append(i.node);
                ResolveNow.resolveImmediately(i.init(document.querySelector('.view-parameters'), () => null)).then(() => i.setInputSelection(selection));
                return i;
            }
            // Set instance to null if no ref is passed
            return null;
        });
    }, [status]);
    React.useEffect(() => {
        if (instance) {
        }
    }, [instance]);
    return [setRef, instance];
}
//# sourceMappingURL=useLoadViewPlugin.js.map