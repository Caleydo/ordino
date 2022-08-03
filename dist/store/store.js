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
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});
export const trrackContext = React.createContext(undefined);
export const useTrrackSelector = createSelectorHook(trrackContext);
//# sourceMappingURL=store.js.map