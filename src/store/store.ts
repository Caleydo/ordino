import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ordinoReducer } from './ordinoSlice';
import { allVisynReducers } from '../visyn/visynReducers';
import { menuReducer } from './menuSlice';
import { appReducer } from './appSlice';
import { trrackable, trrackMiddleware } from './provenance';
import { trrackInstance } from '../app';

export type OrdinoReducer = typeof ordinoReducer;

// export from visyn package all of the visyn reducers that are needed then spread them here. "createVisionReducers"
const allReducers = combineReducers({
  ordino: trrackable(ordinoReducer),
  menu: menuReducer,
  app: appReducer,
  ...allVisynReducers(),
});

export const store = configureStore({
  reducer: allReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend([trrackMiddleware]),
});

(window as any).provenance = () => {
  if (trrackInstance) console.table(JSON.parse(JSON.stringify(trrackInstance.trrack.graph.nodes)));
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof allReducers>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
