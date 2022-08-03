import { PayloadAction } from '@reduxjs/toolkit';
export interface IUserState {
    loggedIn?: boolean;
    userName?: string;
}
export declare const userSlice: import("@reduxjs/toolkit").Slice<IUserState, {
    login(state: import("immer/dist/internal").WritableDraft<IUserState>, action: PayloadAction<string>): void;
    logout(state: import("immer/dist/internal").WritableDraft<IUserState>): void;
}, "user">;
export declare const login: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, string>, logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>;
export declare const userReducer: import("redux").Reducer<IUserState, import("redux").AnyAction>;
//# sourceMappingURL=usersSlice.d.ts.map