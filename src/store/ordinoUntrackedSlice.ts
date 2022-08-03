import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrdinoAppUntrackedState } from './interfaces';

const initialState: IOrdinoAppUntrackedState = {};

export const ordinoUntrackedSlice = createSlice({
  name: 'ordino',
  initialState,
  reducers: {},
});

// export const {} = ordinoUntrackedSlice.actions;

export const ordinoUntrackedReducer = ordinoUntrackedSlice.reducer;
