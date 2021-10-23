declare const _default: import("redux").Store<import("redux").CombinedState<{
    ordino: import("../store/ordinoSlice").IOrdinoAppState;
    users: {
        id: string;
        name: string;
        password: string;
    }[];
}>, import("redux").AnyAction>;
export default _default;
