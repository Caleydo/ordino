import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EStartMenuMode } from '../components/header/StartMenuTabWrapper';

export interface IMenuState {
  activeTab: string;
  mode: EStartMenuMode;
}

const initialState: IMenuState = {
  activeTab: null,
  mode: EStartMenuMode.START,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    setMode(state, action: PayloadAction<EStartMenuMode>) {
      state.mode = action.payload;
    },
  },
});

export const { setActiveTab, setMode } = menuSlice.actions;

export const menuReducer = menuSlice.reducer;
