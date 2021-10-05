import * as React from "react";
import {IRow} from "tdp_core";
import { IOrdinoInstance } from "./Ordino";

/**
 * The context must be JSON serializable
 */
interface IOrdinoAppState {
  /**
   * List of open views
   */
  views: { [key: string]: IOrdinoView; };

  /**
   * Id of the current focus view
   */
  focusViewId: string;
}

interface IOrdinoView {
  /**
   * Unique view id
   */
  id: string;

  /**
   * Id of the previous view (linked list)
   * `null` for the first view
   */
  previousViewId: string | null;

  /**
   * List selected rows
   */
  selection: IRow[];

  /**
   * Selected filters in this view
   */
  filter: any[]; // TODO define filter
}

const defaultState = {
  views: {},
  focusViewId: null
};

interface IOrdinoContext {
  state: IOrdinoAppState;
  setState: React.Dispatch<React.SetStateAction<IOrdinoAppState>>;
}

const OrdinoContext = React.createContext<IOrdinoContext>({
  state: defaultState,
  setState: () => {}
});

export const OrdinoComponent = (props: {
  onCreated(instance: IOrdinoInstance): void;
}) => {
  const [appState, setAppState] = React.useState<IOrdinoAppState>(defaultState);

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
    <OrdinoContext.Provider value={{state: appState, setState: setAppState}}>
      <div className="ordinoApp">
        <div>Navbar</div>
        <div>Breadcrumbs</div>
        <div>Filmstrip</div>
      </div>
    </OrdinoContext.Provider>
  );
};
