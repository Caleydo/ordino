import React from 'react';
import { configureTrrackableStore } from '@trrack/redux';
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
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
    slices: allSlices, // TODO: Figure out type error?
});
export const trrackContext = React.createContext(undefined);
export const useTrrackSelector = createSelectorHook(trrackContext);
//# sourceMappingURL=store.js.map