import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrdinoAppUntrackedState } from './interfaces';

const initialState: IOrdinoAppUntrackedState = {
  isAnimating: false,
};

export const ordinoUntrackedSlice = createSlice({
  name: 'ordino',
  initialState,
  reducers: {
    setAnimating(state, action: PayloadAction<boolean>) {
      state.isAnimating = action.payload;
    },
  },
});
