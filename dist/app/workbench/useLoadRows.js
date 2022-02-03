import React from 'react';
import { useAsync } from 'tdp_core';
export function useLoadData(entityId, viewDesc) {
    const loadData = React.useMemo(() => () => [], [{ id: '1', value: 'value' }]);
    const { status, value: data } = useAsync(loadData, []);
    return [status, data];
}
//# sourceMappingURL=useLoadRows.js.map