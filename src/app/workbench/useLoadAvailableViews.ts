import { FindViewUtils, IDType, IViewPluginDesc } from 'tdp_core';

export async function useLoadAvailableViews(viewId: string): Promise<IViewPluginDesc[]> {
  const discoveredViews = await FindViewUtils.findAllViews(new IDType(viewId, '.*', '', true));
  return discoveredViews.map((views) => views.v);
}
