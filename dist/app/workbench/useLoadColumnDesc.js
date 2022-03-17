import React from 'react';
import { ColumnDescUtils, useAsync } from 'tdp_core';
import { deriveColors } from 'lineupjs';
export function useLoadColumnDesc(entityId, entityMeta) {
    const loadColumnDesc = React.useMemo(() => async () => {
        if (!entityId || !entityMeta) {
            return [];
        }
        const derivedColumns = ColumnDescUtils.deriveColumns(entityMeta.columns);
        const cols = derivedColumns.map((c, i) => ({ ...c, ...entityMeta.columns[i] }));
        deriveColors(cols);
        return cols;
    }, [entityId, entityMeta]);
    return useAsync(loadColumnDesc, []);
}
//# sourceMappingURL=useLoadColumnDesc.js.map