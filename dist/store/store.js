import { combineReducers, createStore } from '@reduxjs/toolkit';
import { ordinoReducer } from './ordinoSlice';
import { allVisynReducers } from '../visyn/visynReducers';
//export from visyn package all of the visyn reducers that are needed then spread them here. "createVisionReducers"
const allReducers = combineReducers({
    ordino: ordinoReducer,
    ...allVisynReducers()
});
export default createStore(allReducers);
//# sourceMappingURL=store.js.map