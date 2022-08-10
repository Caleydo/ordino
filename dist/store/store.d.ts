import React from 'react';
export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
    ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
    user: import("../visyn/usersSlice").IUserState;
    lineup: unknown;
}, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<[import("@reduxjs/toolkit").ListenerMiddleware<unknown, import("redux-thunk").ThunkDispatch<unknown, unknown, import("redux").AnyAction>, unknown>, import("redux-thunk").ThunkMiddleware<{
    ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
    ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
    user: import("../visyn/usersSlice").IUserState;
    lineup: unknown;
}, import("redux").AnyAction, undefined>]> | import("redux").Middleware<{}, {
    ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
    ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
    menu: import("./menuSlice").IMenuState;
    app: import("./appSlice").IAppState;
    user: import("../visyn/usersSlice").IUserState;
    lineup: unknown;
}, import("redux").Dispatch<import("redux").AnyAction>>[]>, trrack: {
    registry: import("@trrack/core").Registry<any>;
    readonly isTraversing: boolean;
    getState(node?: import("@trrack/core").ProvenanceNode<{
        ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
        ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
        menu: import("./menuSlice").IMenuState;
        app: import("./appSlice").IAppState;
        user: import("../visyn/usersSlice").IUserState;
        lineup: unknown;
    }, any, any>): {
        ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
        ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
        menu: import("./menuSlice").IMenuState;
        app: import("./appSlice").IAppState;
        user: import("../visyn/usersSlice").IUserState;
        lineup: unknown;
    };
    graph: {
        changeCurrent: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("@trrack/core").NodeId, string>;
        addNode: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("@trrack/core").StateNode<{
            ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
            ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
            menu: import("./menuSlice").IMenuState;
            app: import("./appSlice").IAppState;
            user: import("../visyn/usersSlice").IUserState;
            lineup: unknown;
        }, string, import("@trrack/core").BaseArtifactType<any>>, string>;
        initialState: {
            nodes: import("@trrack/core").Nodes<{
                ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
                ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
                menu: import("./menuSlice").IMenuState;
                app: import("./appSlice").IAppState;
                user: import("../visyn/usersSlice").IUserState;
                lineup: unknown;
            }, string, import("@trrack/core").BaseArtifactType<any>>;
            current: import("@trrack/core").NodeId;
            root: import("@trrack/core").NodeId;
        };
        backend: {
            nodes: import("@trrack/core").Nodes<{
                ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
                ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
                menu: import("./menuSlice").IMenuState;
                app: import("./appSlice").IAppState;
                user: import("../visyn/usersSlice").IUserState;
                lineup: unknown;
            }, string, import("@trrack/core").BaseArtifactType<any>>;
            current: import("@trrack/core").NodeId;
            root: import("@trrack/core").NodeId;
        };
        current: import("@trrack/core").ProvenanceNode<{
            ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
            ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
            menu: import("./menuSlice").IMenuState;
            app: import("./appSlice").IAppState;
            user: import("../visyn/usersSlice").IUserState;
            lineup: unknown;
        }, string, import("@trrack/core").BaseArtifactType<any>>;
        root: import("@trrack/core").RootNode<{
            ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
            ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
            menu: import("./menuSlice").IMenuState;
            app: import("./appSlice").IAppState;
            user: import("../visyn/usersSlice").IUserState;
            lineup: unknown;
        }, any, any>;
        currentChange(listener: any): () => void;
        update: ((action: import("redux").Action<"listenerMiddleware/add">) => import("@reduxjs/toolkit").UnsubscribeListener) & import("redux-thunk").ThunkDispatch<{
            nodes: import("@trrack/core").Nodes<{
                ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
                ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
                menu: import("./menuSlice").IMenuState;
                app: import("./appSlice").IAppState;
                user: import("../visyn/usersSlice").IUserState;
                lineup: unknown;
            }, string, import("@trrack/core").BaseArtifactType<any>>;
            current: import("@trrack/core").NodeId;
            root: import("@trrack/core").NodeId;
        }, undefined, import("redux").AnyAction> & import("redux").Dispatch<import("redux").AnyAction>;
    };
    readonly current: import("@trrack/core").ProvenanceNode<{
        ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
        ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
        menu: import("./menuSlice").IMenuState;
        app: import("./appSlice").IAppState;
        user: import("../visyn/usersSlice").IUserState;
        lineup: unknown;
    }, string, import("@trrack/core").BaseArtifactType<any>>;
    readonly root: import("@trrack/core").RootNode<{
        ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
        ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
        menu: import("./menuSlice").IMenuState;
        app: import("./appSlice").IAppState;
        user: import("../visyn/usersSlice").IUserState;
        lineup: unknown;
    }, any, any>;
    record({ label, state, sideEffects, eventType, }: {
        label: string;
        state: {
            type: "stateLike";
            val: import("@trrack/core").StateLike<{
                ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
                ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
                menu: import("./menuSlice").IMenuState;
                app: import("./appSlice").IAppState;
                user: import("../visyn/usersSlice").IUserState;
                lineup: unknown;
            }>;
        } | {
            type: "stateWithPatches";
            val: [{
                ordinoTracked: import("./interfaces").IOrdinoAppTrackedState;
                ordinoUntracked: import("./interfaces").IOrdinoAppUntrackedState;
                menu: import("./menuSlice").IMenuState;
                app: import("./appSlice").IAppState;
                user: import("../visyn/usersSlice").IUserState;
                lineup: unknown;
            }, import("immer").Patch[], import("immer").Patch[]];
        };
        eventType: string;
        sideEffects: import("@trrack/core").SideEffects;
    }): void;
    apply<T extends string, Payload = any>(label: string, act: {
        payload: Payload;
        type: T;
    }): void;
    to(node: import("@trrack/core").NodeId): Promise<void>;
    undo(): Promise<void>;
    redo(to?: "latest" | "oldest"): Promise<void>;
    currentChange(listener: any): () => void;
    done(): void;
    tree(): Omit<import("@trrack/core").ProvenanceNode<any, any, any>, "name" | "children"> & {
        name: string;
        children: any[];
    };
    on(event: import("@trrack/core").TrrackEvents, listener: (args?: any) => void): void;
}, trrackStore: import("@reduxjs/toolkit").EnhancedStore<{
    current: import("@trrack/core").NodeId;
}, import("redux").AnyAction, [import("redux-thunk").ThunkMiddleware<{
    current: import("@trrack/core").NodeId;
}, import("redux").AnyAction, undefined>]>;
export declare type RootState = ReturnType<typeof store.getState>;
export declare type AppDispatch = typeof store.dispatch;
export declare const trrackContext: React.Context<any>;
export declare const useTrrackSelector: <Selected extends unknown>(selector: (state: any) => Selected, equalityFn?: (previous: Selected, next: Selected) => boolean) => Selected;
//# sourceMappingURL=store.d.ts.map