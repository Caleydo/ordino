import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IUserState {
  id: string;
  name: string;
  password: string;
}

const initialState: IUserState[] = [
  { id: '1', name: 'Zach Cutler', password: 'admin' },
  { id: '2', name: 'Holger Stitz', password: 'admin' }
];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser(state, action) {
      console.log(action.payload);
      state.push(action.payload);
    },
    changePassword(state, action: PayloadAction<{userIndex: number, password: string}>) {
      state[action.payload.userIndex].password = action.payload.password;
    }
  }
});

//should this be active or passive voice? random thing but active seems better, but docs are passive
export const { addUser, changePassword } = usersSlice.actions;

export const usersReducer = usersSlice.reducer;
