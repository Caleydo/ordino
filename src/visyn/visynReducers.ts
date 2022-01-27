import {Reducer} from '@reduxjs/toolkit';
import {userReducer} from './usersSlice';

export function allVisynReducers() {
    return {
        user: userReducer
    };
}
