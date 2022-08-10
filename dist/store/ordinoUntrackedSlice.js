import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    isAnimating: false,
};
export const ordinoUntrackedSlice = createSlice({
    name: 'ordino',
    initialState,
    reducers: {
        setAnimating(state, action) {
            state.isAnimating = action.payload;
        },
    },
});
//# sourceMappingURL=ordinoUntrackedSlice.js.map