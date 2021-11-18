import {Reducer} from '@reduxjs/toolkit';
import {usersReducer} from './usersSlice';

export function allVisynReducers(): {[key: string]: Reducer} {
    return {
        users: usersReducer
    };
}
