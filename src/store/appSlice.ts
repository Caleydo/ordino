import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// dummy reducer
export interface IAppState {
  ready: boolean;

}


const initialState: IAppState = {
  ready: false

};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setReady(state, action: PayloadAction<boolean>) {
      console.log('HERE')
      state.ready = action.payload;
    }
  }
});

export const {setReady} = appSlice.actions;

export const appReducer = appSlice.reducer;