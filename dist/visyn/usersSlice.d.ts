export interface IUserState {
    loggedIn?: boolean;
    userName?: string;
}
export declare const login: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>, logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>;
export declare const userReducer: import("redux").Reducer<IUserState, import("redux").AnyAction>;
//# sourceMappingURL=usersSlice.d.ts.map