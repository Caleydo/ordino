import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ordinoReducer } from './ordinoSlice';
import { allVisynReducers } from '../visyn/visynReducers';
import { menuReducer } from './menuSlice';
import { appReducer } from './appSlice';
import { trrackable, trrackMiddleware } from './provenance';
import { trrackInstance } from '../app';
// export from visyn package all of the visyn reducers that are needed then spread them here. "createVisionReducers"
const allReducers = combineReducers({
    ordino: trrackable(ordinoReducer),
    menu: menuReducer,
    app: appReducer,
    ...allVisynReducers(),
});
export const store = configureStore({
    reducer: allReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).prepend([trrackMiddleware]),
});
window.provenance = () => {
    if (trrackInstance)
        console.table(JSON.parse(JSON.stringify(trrackInstance.trrack.graph.nodes)));
};
//# sourceMappingURL=store.js.map