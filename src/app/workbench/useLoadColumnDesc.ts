import React from 'react';
import {IReprovisynEntity} from 'reprovisyn';
import {ColumnDescUtils, useAsync} from 'tdp_core';
import {deriveColors} from 'lineupjs';


export function useLoadColumnDesc(entityId: string, entityMeta: IReprovisynEntity) {

    const loadColumnDesc = React.useMemo(() => async () => {
        if (!entityId || !entityMeta) {
            return [];
        }
        const derivedColumns = ColumnDescUtils.deriveColumns(entityMeta.columns);
        const cols = derivedColumns.map((c, i) => ({...c, ...entityMeta.columns[i]}));
        deriveColors(cols);
        return cols;
    }, [entityId, entityMeta]);

    return useAsync(loadColumnDesc, []);
}
