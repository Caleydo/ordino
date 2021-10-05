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
        // set project id to null if the app logo is clicked to return to the project browser
        const appLink = document.querySelector('*[data-header="appLink"]');
        appLink.addEventListener("click", (evt) => {
            evt.preventDefault();
        });
        return () => {
            mounted = false;
        };
    }, []);
    return React.createElement("div", null, "Ordino Component");
};
//# sourceMappingURL=OrdinoComponent.js.map