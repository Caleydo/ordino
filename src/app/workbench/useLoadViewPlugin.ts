import React from "react";
import {AView, EXTENSION_POINT_TDP_VIEW, IViewPlugin, IViewPluginDesc, LoginMenu, PluginRegistry, useAsync, Range, IView, ObjectRefUtils, ResolveNow, IDType, LocalStorageProvenanceGraphManager} from "tdp_core";
import {useAppDispatch, useAppSelector} from "../..";


export function useLoadViewPlugin(viewId: string): [(element: HTMLElement | null) => void, IView | null] {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId) as IViewPluginDesc;
    const dispatch = useAppDispatch();
    const [instance, setInstance] = React.useState<IView | null>(null);
    const loadView = React.useMemo(() => () => {
        return view.load();
    }, []);

    const {status, value: viewPlugin} = useAsync(loadView, []);

    const setRef = React.useCallback(async (ref: HTMLElement | null) => {
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
                const context = {graph: null, ref: {value: {data: null}} as any, desc: view};
                const selection = {idtype: new IDType('Start', 'Start', '', true), range: Range.none()};
                const i = viewPlugin.factory(context, selection, ref, {});
                ref.append(i.node);
                ResolveNow.resolveImmediately(i.init(document.querySelector('.view-parameters'), () => null)).then(() => i.setInputSelection(selection))
                return i
            }
            // Set instance to null if no ref is passed
            return null;
        });
    }, [status]);

    React.useEffect(() => {

        if (instance) {

        }

    }, [instance])

    return [setRef, instance];
}