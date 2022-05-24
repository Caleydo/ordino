export const viewsReducers = {
    addView(state, action) {
        state.workbenches[action.payload.workbenchIndex].views.push(action.payload.view);
    },
    setViewParameters(state, action) {
        state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].parameters = action.payload.parameters;
    },
    setView(state, action) {
        state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].id = action.payload.viewId;
        state.workbenches[action.payload.workbenchIndex].views[action.payload.viewIndex].name = action.payload.viewName;
    },
    switchViews(state, action) {
        const temp = state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex];
        state.workbenches[action.payload.workbenchIndex].views[action.payload.firstViewIndex] =
            state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex];
        state.workbenches[action.payload.workbenchIndex].views[action.payload.secondViewIndex] = temp;
    },
    removeView(state, action) {
        const workbench = state.workbenches[action.payload.workbenchIndex];
        workbench.views.splice(action.payload.viewIndex, 1);
    },
};
//# sourceMappingURL=viewsReducer.js.map