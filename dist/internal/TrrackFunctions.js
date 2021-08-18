import { initProvenance, createAction } from "../trrack/src/index";
const initialState = {
    viewList: [],
    focusView: 0
};
const createViewAction = createAction((state, id, idType, selection, options) => {
    console.log("in create action");
    state.viewList.push({
        viewId: id,
        idType: idType,
        selection: selection,
        options: options,
        dump: {}
    });
    state.focusView = state.viewList.length - 1;
})
    .setEventType("Create View");
const removeViewAction = createAction((state, removedIndex) => {
    console.log("in remove action");
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
    console.log("in change action");
    state.viewList.splice(newIndex);
    state.viewList.push({
        viewId: id,
        idType: idType,
        selection: selection,
        options: options,
        dump: {}
    });
    state.focusView = state.viewList.length - 1;
}).setEventType("Replace View");
const focusViewAction = createAction((state, newIndex) => {
    console.log("in focus action");
    state.focusView = newIndex;
})
    .setEventType("Change Focus View");
const allLineupActions = createAction((state, dump, index) => {
    state.viewList[index].dump = dump;
})
    .setEventType("Lineup Action");
export const provenanceActions = {
    createViewAction,
    removeViewAction,
    focusViewAction,
    selectFocusAction,
    selectSecondaryAction,
    replaceViewAction,
    allLineupActions
};
export const prov = initProvenance(initialState, {
    loadFromUrl: false,
});
//# sourceMappingURL=TrrackFunctions.js.map