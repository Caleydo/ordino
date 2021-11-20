export declare const store: import("@reduxjs/toolkit").EnhancedStore<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./ordinoSlice").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
}>, import("redux").AnyAction, [import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./ordinoSlice").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
}>, import("redux").AnyAction, null> | import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./ordinoSlice").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
}>, import("redux").AnyAction, undefined>]>;
export declare type RootState = ReturnType<typeof store.getState>;
export declare type AppDispatch = typeof store.dispatch;
