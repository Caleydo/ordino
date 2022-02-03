import React from 'react';
import {EReprovisynRelationType, IReprovisynEntity, ReprovisynRestBaseUtils} from 'reprovisyn';
import {IViewPluginDesc, useAsync} from 'tdp_core';


export function useLoadData(entityId: string, entityMetadata: IReprovisynEntity, viewDesc: IViewPluginDesc, inputSelection: string[] = []) {

    const loadData = React.useMemo(() => async () => {
        if (!entityId || !viewDesc || !entityMetadata) {
            return [];
        }
        const {sourceEntity, targetEntity, mapping, relationType, isSourceToTarget} = viewDesc;
        let rows = [];

        if (sourceEntity && targetEntity && relationType && inputSelection.length > 0) {
            // for both 1:n relations and ordino drilldown the data is first loaded in total. Ordino drilldown columns are
            // loaded in the selection adapter
            if (relationType === EReprovisynRelationType.OneToN || relationType === EReprovisynRelationType.MToN || relationType === EReprovisynRelationType.OrdinoDrilldown) {
                rows = await ReprovisynRestBaseUtils.getEntityDataRowsForSelection({entityId: viewDesc.itemIDType, relationInfo: {relationType, source: sourceEntity, target: targetEntity, mapping, isSourceToTarget, selectedValues: inputSelection}});
            }
        } else {
            rows = await ReprovisynRestBaseUtils.getAllDataRows(viewDesc.itemIDType, entityMetadata.columns.map((col) => col.column));
        }

        return rows;
    }, [entityId, viewDesc, entityMetadata]);

    const {status, value: data} = useAsync(loadData, []);

    return {status, data};
}
