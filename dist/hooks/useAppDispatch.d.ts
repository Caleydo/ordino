export declare const useAppDispatch: () => import("redux-thunk").ThunkDispatch<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("..").IOrdinoAppState;
    menu: import("..").IMenuState;
    app: import("../store/appSlice").IAppState;
}>, null, import("redux").AnyAction> & import("redux-thunk").ThunkDispatch<import("redux").CombinedState<{
    user: import("..").IUserState;
    ordino: import("..").IOrdinoAppState;
    menu: import("..").IMenuState;
    app: import("../store/appSlice").IAppState;
}>, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>;
