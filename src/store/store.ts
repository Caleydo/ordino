import { configureTrrackableStore } from '@trrack/redux';
import React from 'react';
import { createSelectorHook } from 'react-redux';

import { userSlice } from '../visyn/usersSlice';
import { appSlice } from './appSlice';
import { menuSlice } from './menuSlice';
import { ordinoTrrackedSlice } from './ordinoTrrackedSlice';
import { ordinoUntrackedSlice } from './ordinoUntrackedSlice';

// export from visyn package all of the visyn reducers that are needed then spread them here. "createVisionReducers"

const allSlices = [ordinoTrrackedSlice, menuSlice, appSlice, userSlice];

export const { store, trrack, trrackStore } = configureTrrackableStore({
  reducer: {
    ordinoTracked: ordinoTrrackedSlice.reducer,
    ordinoUntracked: ordinoUntrackedSlice.reducer,
    menu: menuSlice.reducer,
    app: appSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  slices: allSlices,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const trrackContext = React.createContext(undefined!);

export const useTrrackSelector = createSelectorHook(trrackContext);
