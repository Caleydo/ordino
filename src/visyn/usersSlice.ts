import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface IUserState {
  loggedIn?: boolean;
}

const initialState: IUserState = {
  loggedIn: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state) {
      state.loggedIn = true;
    },
    logout(state) {
      state.loggedIn = false;
    },
  }
});

//should this be active or passive voice? random thing but active seems better, but docs are passive
export const {login, logout} = userSlice.actions;

export const userReducer = userSlice.reducer;
