import { createTrrackableStore } from '@trrack/redux';
import React from 'react';
import { createSelectorHook } from 'react-redux';
import { menuSlice } from './menuSlice';
import { appSlice } from './appSlice';
import { userSlice } from '../visyn/usersSlice';
import { ordinoTrrackedSlice } from './ordinoTrrackedSlice';
import { ordinoUntrackedSlice } from './ordinoUntrackedSlice';

// export from visyn package all of the visyn reducers that are needed then spread them here. "createVisionReducers"
const allSlices = {
  ordinoTracked: ordinoTrrackedSlice,
  ordinoUntracked: ordinoUntrackedSlice,
  menu: menuSlice,
  app: appSlice,
  user: userSlice,
};

export const { store, trrack, trrackStore } = createTrrackableStore({
  slices: allSlices,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const trrackContext = React.createContext(undefined!);

export const useTrrackSelector = createSelectorHook(trrackContext);
