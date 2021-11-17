import { combineReducers, createStore } from '@reduxjs/toolkit';
import { ordinoReducer } from './ordinoSlice';
import { allVisynReducers } from '../visyn/visynReducers';
import { menuReducer } from './menuSlice';
//export from visyn package all of the visyn reducers that are needed then spread them here. "createVisionReducers"
const allReducers = combineReducers({
    ordino: ordinoReducer,
    menu: menuReducer,
    ...allVisynReducers()
});
export const store = createStore(allReducers);
//# sourceMappingURL=store.js.map