import { createSlice } from '@reduxjs/toolkit';
import { EStartMenuMode } from '../components/header/StartMenuTabWrapper';
const initialState = {
    activeTab: null,
    mode: EStartMenuMode.START
};
const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setActiveTab(state, action) {
            state.activeTab = action.payload;
        },
        setMode(state, action) {
            state.mode = action.payload;
        }
    }
});
export const { setActiveTab, setMode } = menuSlice.actions;
export const menuReducer = menuSlice.reducer;
//# sourceMappingURL=menuSlice.js.map