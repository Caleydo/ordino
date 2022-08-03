import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserState {
  loggedIn?: boolean;
  userName?: string;
}

const initialState: IUserState = {
  loggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.loggedIn = true;
      state.userName = action.payload;
    },
    logout(state) {
      state.loggedIn = false;
      state.userName = null;
    },
  },
});

// should this be active or passive voice? random thing but active seems better, but docs are passive
export const { login, logout } = userSlice.actions;

export const userReducer = userSlice.reducer;
