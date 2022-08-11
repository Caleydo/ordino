import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IReprovisynProject {
  name: string;
  id: number;
  owner: IReprovisynUser;
  description: string;
  collabs: IReprovisynUser[];
  createdAt: Date;
  permissions: string;
}

export interface IReprovisynUser {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  active: boolean;
  email?: string;
  lastLogin?: Date;
  createdOn: Date;
  changedOn?: Date;
}

export interface IMenuState {
  activeTab: string;
  mode: EStartMenuMode;
  currentProject: IReprovisynProject;
  allProjects: IReprovisynProject[];
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
    setCurrentProject(state, action: PayloadAction<{ project: IReprovisynProject }>) {
      state.currentProject = action.payload.project;
    },
    setAllProjects(state, action: PayloadAction<{ projects: IReprovisynProject[] }>) {
      state.allProjects = action.payload.projects;
    },
  },
});

export const { setActiveTab, setMode, setCurrentProject, setAllProjects } = menuSlice.actions;

export const menuReducer = menuSlice.reducer;
