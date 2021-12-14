import { createSlice } from '@reduxjs/toolkit';
import { deriveColors } from 'lineupjs';
import { ColumnDescUtils } from '../../../tdp_core/dist';
const initialState = {
    ready: false
};
/**
 * generates the column descriptions based on the given server columns by default they are mapped
 * @param {IServerColumn[]} columns
 * @returns {IAdditionalColumnDesc[]}
 */
function getColumnDescs(columns) {
    return ColumnDescUtils.deriveColumns(columns);
}
function getColumns() {
    return loadColumnDesc().then(({ columns }) => {
        const cols = getColumnDescs(columns);
        // compatibility since visible is now a supported feature, so rename ones
        for (const col of cols) {
            if (col.visible != null) {
                col.initialColumn = col.visible;
                delete col.visible;
            }
        }
        deriveColors(cols);
        return cols;
    });
}
async function loadColumnDesc() {
    return await ReprovisynRestBaseUtils.getEntityColumnDesc(this.itemIDType.id);
}
async function loadRows() {
    this.entityMetadata = await ReprovisynRestBaseUtils.getEntityMetadata(this.itemIDType.id);
    // we transform to string to comply with expected data type for the endpoint request
    const selectedRows = this.selection.range.dims.map((range1d) => range1d.asList()).flat().map((v) => v.toString());
    let rows = [];
    // we are only looking for the relation column values (defined in the reprovisyn relation)
    // if a previous selection exists, we try to filter according to it
    const relation = this.context.desc.relation;
    if (relation && selectedRows.length > 0) {
        // for both 1:n relations and ordino drilldown the data is first loaded in total. Ordino drilldown columns are
        // loaded in the selection adapter
        if (relation.type === EReprovisynRelationType.OneToN || relation.type === EReprovisynRelationType.OrdinoDrilldown) {
            rows = await ReprovisynRestBaseUtils.getEntityDataRowsForSelection(this.itemIDType.id, relation, selectedRows, []);
        }
        else if (relation.type === EReprovisynRelationType.MToN) {
            rows = await ReprovisynRestBaseUtils.getEntityDataRowsForSelection(this.itemIDType.id, relation, selectedRows, []);
        }
    }
    else {
        rows = await ReprovisynRestBaseUtils.getAllEntityDataRows(this.itemIDType.id);
    }
    return rows;
}
const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setReady(state, action) {
            console.log('HERE');
            state.ready = action.payload;
        }
    }
});
export const { setReady } = appSlice.actions;
export const appReducer = appSlice.reducer;
//# sourceMappingURL=dataSlice.js.map