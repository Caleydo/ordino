import * as React from "react";
const defaultState = {
    views: {},
    focusViewId: null
};
const OrdinoContext = React.createContext({
    state: defaultState,
    setState: () => { }
});
export const OrdinoComponent = (props) => {
    const [appState, setAppState] = React.useState(defaultState);
    React.useEffect(() => {
        let mounted = true;
        // Allow the object refs to be created before replaying the session
        props.onCreated({
            initApp: () => {
                return Promise.resolve();
            },
            initEmptySession: () => Promise.resolve(),
        });
        return () => {
            mounted = false;
        };
    }, []);
    return (React.createElement(OrdinoContext.Provider, { value: { state: appState, setState: setAppState } },
        React.createElement("div", { className: "ordinoApp" },
            React.createElement("div", null, "Navbar"),
            React.createElement("div", null, "Breadcrumbs"),
            React.createElement("div", null, "Filmstrip"))));
};
//# sourceMappingURL=OrdinoComponent.js.map