import { createSlice } from '@reduxjs/toolkit';
import { EStartMenuMode } from '../components/header/menu/StartMenuTabWrapper';
const initialState = {
    activeTab: null,
    mode: EStartMenuMode.START
};
const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setActiveTab(state, action) {
            state.activeTab = action.payload.activeTab;
        }
    }
});
export const { setActiveTab } = menuSlice.actions;
export const menuReducer = menuSlice.reducer;
//# sourceMappingURL=MenuSlice.js.map