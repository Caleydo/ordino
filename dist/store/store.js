import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ordinoReducer } from './ordinoSlice';
import { allVisynReducers } from '../visyn/visynReducers';
import { menuReducer } from './menuSlice';
import { appReducer } from './appSlice';
//export from visyn package all of the visyn reducers that are needed then spread them here. "createVisionReducers"
const allReducers = combineReducers({
    ordino: ordinoReducer,
    menu: menuReducer,
    app: appReducer,
    ...allVisynReducers()
});
export const store = configureStore({ reducer: allReducers });
//# sourceMappingURL=store.js.map