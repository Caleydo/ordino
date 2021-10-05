import * as React from "react";
import { IOrdinoInstance } from "./Ordino";
import { AppHeader } from "phovea_ui";

export const OrdinoComponent = (props: {
  header: AppHeader;
  onCreated(instance: IOrdinoInstance): void;
}) => {
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
    const appLink = document.querySelector(
      '*[data-header="appLink"]'
    ) as HTMLElement;
    appLink.addEventListener("click", (evt: MouseEvent) => {
      evt.preventDefault();
    });

    return () => {
      mounted = false;
    };
  }, []);

  return <div>Ordino Component</div>;
};
