import { combineReducers, createStore } from "@reduxjs/toolkit";
import {ordinoReducer} from "../store/ordinoSlice";
import {usersReducer} from "./usersSlice";

//export from visyn package all of the visyn reducers that are needed then spread them here. "createVisionReducers"
let allReducers = combineReducers({
  ordino: ordinoReducer,
  users: usersReducer
});

export default createStore(allReducers);
