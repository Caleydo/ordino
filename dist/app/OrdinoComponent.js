import * as React from "react";
export const OrdinoComponent = (props) => {
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
    return (React.createElement("div", { className: "ordinoApp" },
        React.createElement("div", null, "Navbar"),
        React.createElement("div", null, "Breadcrumbs"),
        React.createElement("div", null, "Filmstrip")));
};
//# sourceMappingURL=OrdinoComponent.js.map