export const workbenchReducers = {
    addFirstWorkbench(state, action) {
        state.focusWorkbenchIndex = 0;
        // state.workbenches.splice(0, state.workbenches.length);
        // state.workbenches.push(action.payload.workbench);
        // state.globalQuery = action.payload.globalQuery;
        // state.appliedQueryFilter = action.payload.appliedQueryFilter;
        state.workbenches = [action.payload.workbench];
        state.globalQuery = action.payload.globalQuery;
        state.appliedQueryFilter = action.payload.appliedQueryFilter;
    },
    addWorkbench(state, action) {
        // always add the global query to the next workbench
        // by default the first view will be a ranking view that can deal with the global query parameter
        Object.assign(action.payload.views[0].parameters, { globalQuery: state.globalQuery, appliedQueryFilter: state.appliedQueryFilter });
        if (state.workbenches.length > action.payload.index) {
            state.workbenches.splice(action.payload.index);
        }
        state.workbenches.push(action.payload);
    },
    changeSelectedMappings(state, action) {
        const currentWorkbench = state.workbenches[action.payload.workbenchIndex];
        const { newMapping } = action.payload;
        if (!currentWorkbench.selectedMappings.find((m) => {
            const { entityId, columnSelection } = newMapping;
            return m.entityId === entityId && m.columnSelection === columnSelection;
        })) {
            currentWorkbench.selectedMappings.push(newMapping);
        }
        else {
            currentWorkbench.selectedMappings = currentWorkbench.selectedMappings.filter((m) => {
                const { entityId, columnSelection } = newMapping;
                return !(m.entityId === entityId && m.columnSelection === columnSelection);
            });
        }
    },
    setDetailsSidebarOpen(state, action) {
        state.workbenches[action.payload.workbenchIndex].detailsSidebarOpen = action.payload.open;
    },
    setCreateNextWorkbenchSidebarOpen(state, action) {
        state.workbenches[action.payload.workbenchIndex].createNextWorkbenchSidebarOpen = action.payload.open;
    },
    createColumnDescs(state, action) {
        const { workbenchIndex, desc } = action.payload;
        state.workbenches[workbenchIndex].columnDescs = desc;
    },
    addColumnDesc(state, action) {
        const { workbenchIndex } = action.payload;
        state.workbenches[workbenchIndex].columnDescs.push(action.payload.desc);
    },
    setWorkbenchDirection(state, action) {
        state.workbenches[action.payload.workbenchIndex].viewDirection = action.payload.direction;
    },
    removeWorkbench(state, action) {
        state.workbenches.splice(action.payload.index, state.workbenches.length);
    },
    replaceWorkbench(state, action) {
        state.workbenches.splice(action.payload.workbenchIndex);
        state.workbenches.push(action.payload.newWorkbench);
    },
    addSelection(state, action) {
        const { workbenchIndex, newSelection } = action.payload;
        state.workbenches[workbenchIndex].selection = newSelection;
    },
    addFilter(state, action) {
        state.workbenches[action.payload.workbenchIndex].views.find((v) => v.uniqueId === action.payload.viewId).filters = action.payload.filter;
    },
    setWorkbenchData(state, action) {
        const { workbenchIndex, data } = action.payload;
        for (const row of data) {
            state.workbenches[workbenchIndex].data[row.id] = row;
        }
    },
    addScoreColumn(state, action) {
        const { workbenchIndex, desc, data } = action.payload;
        state.workbenches[workbenchIndex].columnDescs.push(desc);
        for (const row of data) {
            const dataRow = state.workbenches[workbenchIndex].data[row.id];
            if (dataRow) {
                dataRow[desc.scoreID] = row.score;
            } // TODO: BUG the score should not add a new row when the id does not exist in my current data else {
            //   state.workbenches[state.focusViewIndex].data[row.id] = row;
            // }
        }
    },
    setCommentsOpen(state, action) {
        const { workbenchIndex, isOpen } = action.payload;
        state.workbenches[workbenchIndex].commentsOpen = isOpen;
    },
};
//# sourceMappingURL=workbenchReducer.js.map