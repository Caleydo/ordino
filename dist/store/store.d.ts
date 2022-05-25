import { ordinoReducer } from './ordinoSlice';
export declare type OrdinoReducer = typeof ordinoReducer;
declare const allReducers: import("redux").Reducer<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./interfaces").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
}>, import("redux").AnyAction>;
export declare const store: import("@reduxjs/toolkit").EnhancedStore<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./interfaces").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
}>, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./interfaces").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
}>, import("redux").AnyAction, null> | import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./interfaces").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
}>, import("redux").AnyAction, undefined> | import("redux").Middleware<{}, import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./interfaces").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
}>, import("redux").Dispatch<import("redux").AnyAction>>>>;
export declare type RootState = ReturnType<typeof allReducers>;
export declare type AppDispatch = typeof store.dispatch;
export {};
//# sourceMappingURL=store.d.ts.map