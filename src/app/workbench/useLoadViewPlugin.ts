import React, { useMemo } from 'react';
import { ARankingView, EXTENSION_POINT_TDP_VIEW, FindViewUtils, IDType, IDTypeManager, IView, PluginRegistry, ResolveNow, useAsync } from 'tdp_core';
import { useAppSelector } from '../../hooks/useAppSelector';
import { IWorkbench } from '../../store/ordinoSlice';
import { getAllFilters } from '../../store/storeUtils';

export function useLoadViewPlugin(viewId: string, workbenchIndex: number): [(element: HTMLElement | null) => void, IView | null] {
  const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);

  const ordino = useAppSelector((state) => state.ordino);
  const [instance, setInstance] = React.useState<IView | null>(null);
  const loadView = React.useMemo(
    () => () => {
      return view.load();
    },
    // Disabling since this file is nonsense anyways, will be removed when a react Ranking view is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { status, value: viewPlugin } = useAsync(loadView, []);

  const prevWorkbench: IWorkbench | null = useMemo(() => {
    if (workbenchIndex > 0) {
      return ordino.workbenches[workbenchIndex - 1];
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordino.workbenches]);

  const setRef = React.useCallback(
    async (ref: HTMLElement | null) => {
      // Create a new one if there is a ref
      if (ref && status === 'success') {
        ref.innerHTML = '';

        const idType = !prevWorkbench ? 'Start' : prevWorkbench.entityId;

        const inputSelection = { idtype: new IDType(idType, viewId, '', true), ids: !prevWorkbench ? [] : Array.from(prevWorkbench.selection) };

        const selection = { idtype: new IDType(idType, viewId, '', true), ids: Array.from(ordino.workbenches[workbenchIndex].selection) };

        FindViewUtils.findAllViews(selection.idtype).then((availableViews) => {
          const filteredViews = availableViews.filter((v) => viewId.endsWith(v.v.itemIDType));

          const context = { graph: null, ref: { value: { data: null } } as any, desc: workbenchIndex === 0 ? view : filteredViews[0].v };

          const i = viewPlugin.factory(context, inputSelection, ref, { enableVisPanel: false });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status, ordino.workbenches[workbenchIndex].selectedMappings, prevWorkbench?.selection],
  );

  /**
   * These next 2 use effects are strictly for Ranking Views. TODO:: Where to add this type of view-specific code? OR should every view have a simple way to pass selections/filters?
   */
  React.useEffect(() => {
    if (instance && instance instanceof ARankingView) {
      const rankingView: ARankingView = instance;
      const id = IDTypeManager.getInstance().resolveIdType(rankingView.itemIDType.id);

      rankingView.selectionHelper.setGeneralVisSelection({ idtype: id, ids: ordino.workbenches[workbenchIndex].selection });
    }
    // Disabling since this file is nonsense anyways, will be removed when a react Ranking view is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, ordino.workbenches[workbenchIndex].selection]);

  React.useEffect(() => {
    if (instance && instance instanceof ARankingView) {
      const rankingView: ARankingView = instance;
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
