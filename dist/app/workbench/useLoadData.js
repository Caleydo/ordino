import React from 'react';
import { EReprovisynRelationType, ReprovisynRestUtils } from 'reprovisyn';
import { useAsync } from 'tdp_core';
export function useLoadData(entityId, entityMetadata, viewDesc, inputSelection = []) {
    const loadData = React.useMemo(() => async () => {
        if (!entityId || !viewDesc || !entityMetadata) {
            return [];
        }
        const { sourceEntity, targetEntity, mapping, relationType, isSourceToTarget } = viewDesc;
        let rows = [];
        if (sourceEntity && targetEntity && relationType && inputSelection.length > 0) {
            // for both 1:n relations and ordino drilldown the data is first loaded in total. Ordino drilldown columns are
            // loaded in the selection adapter
            if (relationType === EReprovisynRelationType.OneToN ||
                relationType === EReprovisynRelationType.MToN ||
                relationType === EReprovisynRelationType.OrdinoDrilldown) {
                rows = await ReprovisynRestUtils.getDataRowsForSelection({
                    entityId: viewDesc.itemIDType,
                    relationInfo: { relationType, source: sourceEntity, target: targetEntity, mapping, isSourceToTarget, selectedValues: inputSelection },
                });
            }
        }
        else {
            rows = await ReprovisynRestUtils.getAllDataRows(viewDesc.itemIDType, entityMetadata.columns.map((col) => col.column));
        }
        return rows;
    }, [entityId, viewDesc, entityMetadata, inputSelection]);
    const { status, value: data } = useAsync(loadData, []);
    return { status, data };
}
//# sourceMappingURL=useLoadData.js.map