import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {ordinoReducer} from './ordinoSlice';
import {allVisynReducers} from '../visyn/visynReducers';
import {menuReducer} from './menuSlice';

//export from visyn package all of the visyn reducers that are needed then spread them here. "createVisionReducers"
const allReducers = combineReducers({
  ordino: ordinoReducer,
  menu: menuReducer,
  ...allVisynReducers()
});

export const store = configureStore({reducer: allReducers});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
