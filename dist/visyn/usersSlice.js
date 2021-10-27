import { createSlice } from '@reduxjs/toolkit';
const initialState = [
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
        changePassword(state, action) {
            state[action.payload.user] = action.payload.password;
        }
    }
});
//should this be active or passive voice? random thing but active seems better, but docs are passive
export const { addUser, changePassword } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
//# sourceMappingURL=usersSlice.js.map