export declare const addUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, changePassword: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>;
export declare const usersReducer: import("redux").Reducer<{
    id: string;
    name: string;
    password: string;
}[], import("redux").AnyAction>;
