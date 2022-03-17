import { useMemo } from 'react';
import { PluginRegistry, useAsync, EXTENSION_POINT_VISYN_VIEW, IVisynViewPlugin, IVisynViewPluginFactory } from 'tdp_core';

export function useVisynViewPlugin(viewId: string): [IVisynViewPlugin, () => IVisynViewPluginFactory] {
  const view = PluginRegistry.getInstance().getVisynPlugin(EXTENSION_POINT_VISYN_VIEW, viewId);

  // TODO:: Handle view being null
  const { status, value: viewPlugin } = useAsync(view.load, []);

  console.log(viewPlugin);

  // TODO:: need to make this typesafe at some point
  return [viewPlugin, () => (viewPlugin ? viewPlugin?.factory() : null)];
}
