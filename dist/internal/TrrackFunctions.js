import { initProvenance, createAction } from "../trrack/src/index";
const initialState = {
    viewList: [],
    focusView: 0
};
const createViewAction = createAction((state, id, idType, selection, options) => {
    state.viewList.push({
        viewId: id,
        idType: idType,
        selection: selection,
        options: options,
        rankings: [
            {
                sort: {
                    isSingleSort: true,
                    rid: 0,
                    columns: [],
                },
                group: {
                    rid: 0,
                    columns: [],
                },
                columns: [],
            },
        ],
    });
    state.focusView = state.viewList.length - 1;
})
    .setEventType("Create View");
const sortAction = createAction((state, rid, columns, isSingleSort, index) => {
    state.viewList[index].rankings[rid].sort = {
        isSingleSort: isSingleSort,
        rid: rid,
        columns: columns
    };
}).setEventType("Sort View");
const groupAction = createAction((state, rid, columns, index) => {
    state.viewList[index].rankings[rid].group = {
        rid: rid,
        columns: columns
    };
}).setEventType("Group View");
const setMetadataAction = createAction((state, column, rid, label, summary, description, index, columnInfo) => {
    console.log(state);
    if (columnInfo) {
        state.viewList[index].rankings[rid].columns = columnInfo;
    }
    console.log(state);
    state.viewList[index].rankings[rid].columns.filter(c => c.id === column)[0].metadata = {
        rid: rid,
        col: column,
        label: label,
        summary: summary,
        description: description
    };
}).setEventType("Group View");
const filterAction = createAction((state, column, rid, value, isRegExp, filterMissing, index) => {
    state.viewList[index].rankings[rid].columns.filter(c => c.id === column)[0].filter = {
        rid: rid,
        col: column,
        value: value,
        isRegExp: isRegExp,
        filterMissing: filterMissing,
    };
}).setEventType("Filter Column");
const removeViewAction = createAction((state, removedIndex) => {
    state.viewList.splice(removedIndex);
    state.focusView = state.viewList.length - 1;
}).setEventType("Remove View");
const selectFocusAction = createAction((state, idtype, range) => {
    state.viewList[state.focusView].selection = range;
    state.viewList[state.focusView].idType = idtype;
}).setEventType("Select Focus");
const selectSecondaryAction = createAction((state, idtype, range) => {
    state.viewList[state.focusView - 1].selection = range;
    state.viewList[state.focusView - 1].idType = idtype;
}).setEventType("Select Secondary");
const replaceViewAction = createAction((state, newIndex, id, idType, selection, options) => {
    state.viewList.splice(newIndex);
    state.viewList.push({
        viewId: id,
        idType: idType,
        selection: selection,
        options: options,
        rankings: [
            {
                sort: {
                    isSingleSort: true,
                    rid: 0,
                    columns: [],
                },
                group: {
                    rid: 0,
                    columns: [],
                },
                columns: [],
            },
        ],
    });
    state.focusView = state.viewList.length - 1;
}).setEventType("Replace View");
const focusViewAction = createAction((state, newIndex) => {
    state.focusView = newIndex;
})
    .setEventType("Change Focus View");
export const provenanceActions = {
    createViewAction,
    removeViewAction,
    focusViewAction,
    selectFocusAction,
    selectSecondaryAction,
    replaceViewAction,
    sortAction,
    groupAction,
    filterAction,
    setMetadataAction
};
export const prov = initProvenance(initialState, {
    loadFromUrl: false,
});
//# sourceMappingURL=TrrackFunctions.js.map