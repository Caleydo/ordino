interface IUserState {
    id: string;
    name: string;
    password: string;
}
export declare const addUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, changePassword: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<{
    userIndex: number;
    password: string;
}, string>;
export declare const usersReducer: import("redux").Reducer<IUserState[], import("redux").AnyAction>;
export {};
