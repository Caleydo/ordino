export declare const store: import("@reduxjs/toolkit").EnhancedStore<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./ordinoSlice").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
}>, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./ordinoSlice").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
}>, import("redux").AnyAction, null> | import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./ordinoSlice").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
}>, import("redux").AnyAction, undefined> | import("redux").Middleware<{}, import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("./ordinoSlice").IOrdinoAppState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
}>, import("redux").Dispatch<import("redux").AnyAction>>>>;
export declare type RootState = ReturnType<typeof store.getState>;
export declare type AppDispatch = typeof store.dispatch;
//# sourceMappingURL=store.d.ts.map