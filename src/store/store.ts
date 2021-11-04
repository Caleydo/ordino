import { combineReducers, configureStore, createStore } from '@reduxjs/toolkit';
import {ordinoReducer} from './ordinoSlice';
import {usersReducer} from '../visyn/usersSlice';
import {allVisynReducers} from '../visyn/visynReducers';

//export from visyn package all of the visyn reducers that are needed then spread them here. "createVisionReducers"
const allReducers = combineReducers({
  ordino: ordinoReducer,
  ...allVisynReducers()
});

export const store = configureStore({reducer: allReducers});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
