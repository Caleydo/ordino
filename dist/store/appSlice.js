import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    ready: false
};
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
//# sourceMappingURL=appSlice.js.map