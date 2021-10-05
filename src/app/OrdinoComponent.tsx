import * as React from "react";
import { IOrdinoInstance } from "./Ordino";

export const OrdinoComponent = (props: {
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

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="ordinoApp">
      <div>Navbar</div>
      <div>Breadcrumbs</div>
      <div>Filmstrip</div>
    </div>
  );
};
