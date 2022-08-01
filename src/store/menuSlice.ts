import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IMenuState {
  activeTab: string;
  mode: EStartMenuMode;
  currentProject: string;
  allProjects: string[];
}

export enum EStartMenuMode {
  /**
   * no analysis in the background, the start menu cannot be closed
   */
  START = 'start',

  /**
   * an analysis in the background, the start menu can be closed
   */
  OVERLAY = 'overlay',
}

export enum EStartMenuOpen {
  /**
   * no analysis in the background, the start menu cannot be closed
   */
  OPEN = 'open',

  /**
   * an analysis in the background, the start menu can be closed
   */
  CLOSED = 'closed',
}

const initialState: IMenuState = {
  activeTab: null,
  mode: EStartMenuMode.START,
  currentProject: null,
  allProjects: [],
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
    setCurrentProject(state, action: PayloadAction<string>) {
      state.currentProject = action.payload;
    },
    setAllProjects(state, action: PayloadAction<string[]>) {
      state.allProjects = action.payload;
    },
  },
});

export const { setActiveTab, setMode, setCurrentProject, setAllProjects } = menuSlice.actions;

export const menuReducer = menuSlice.reducer;
