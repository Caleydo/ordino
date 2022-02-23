import { FindViewUtils, IDType } from 'tdp_core';
export async function useLoadAvailableViews(viewId) {
    const discoveredViews = await FindViewUtils.findAllViews(new IDType(viewId, '.*', '', true));
    return discoveredViews.map((views) => views.v);
}
//# sourceMappingURL=useLoadAvailableViews.js.map