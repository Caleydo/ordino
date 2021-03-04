import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CLUEGraphManager} from 'phovea_clue';
import {BaseUtils, GlobalEventHandler, ProvenanceGraph} from 'phovea_core';
import {IOrdinoOptions, Ordino} from '../..';
import {DatasetsTab, SessionsTab, ToursTab} from './tabs';




interface IStartMenuTab {
  id: string;
  title: string;
  enabled: boolean;
}

interface IStartMenuTabProps {
  tabs: IStartMenuTab[];
  active: IStartMenuTab;
  setActive: React.Dispatch<React.SetStateAction<IStartMenuTab>>;
}


// tslint:disable-next-line: variable-name
export const GraphContext = React.createContext<{graph: ProvenanceGraph, manager: CLUEGraphManager, options: IOrdinoOptions}>(null);

export function StartMenuComponent({headerMainMenu, manager, graph, options}: {headerMainMenu: HTMLElement, manager: CLUEGraphManager, graph: ProvenanceGraph, options: IOrdinoOptions}) {

  const defaultConfig = {
    enableDatasetsTab: true,
    enableSessionsTab: true,
    enableToursTab: true,
    enableOtherTab: true
  }

  const {
    enableDatasetsTab,
    enableToursTab,
    enableSessionsTab,
    enableOtherTab
  } = BaseUtils.mixin(defaultConfig, options.clientConfig || {});

  const [tabs] = React.useState<IStartMenuTab[]>([
    {id: 'datasets', title: 'Datasets', enabled: enableDatasetsTab},
    {id: 'sessions', title: 'Analysis Sessions', enabled: enableSessionsTab},
    {id: 'tours', title: 'Tours', enabled: enableToursTab},
    {id: 'more', title: 'More', enabled: enableOtherTab},
  ].filter((t) => {
    return t.enabled;
  }))


  const [active, setActive] = React.useState(null);

  React.useEffect(() => {
    const listener = () => setActive(tabs[0]);
    GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);

    return () => {
      GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
    };
  }, []);


  return (
    <>
      {ReactDOM.createPortal(

        <MainMenuLinks tabs={tabs} active={active} setActive={(a) => setActive(a)}></MainMenuLinks>,
        headerMainMenu
      )}
      <GraphContext.Provider value={{manager, graph, options}}>
        <StartMenu tabs={tabs} active={active} setActive={setActive}></StartMenu>
      </GraphContext.Provider>
    </>
  );
}

function MainMenuLinks(props: IStartMenuTabProps) {
  return (
    <>
      {props.tabs.map((tab) => (
        <li className="nav-item" key={tab.id}>
          <a className="nav-link"
            href={`#${tab.id}`}
            id={`${tab.id}-tab`}
            role="tab"
            aria-controls={tab.id}
            aria-selected={(props.active === tab)}
            onClick={(evt) => {
              evt.preventDefault();
              window.scrollTo(0, 0);
              if (props.active === tab) {
                props.setActive(null);
              } else {
                props.setActive(tab);
              }
              return false;
            }}
          >
            {tab.title}
          </a>
        </li>
      ))}
    </>
  );
}


function StartMenu(props: IStartMenuTabProps) {
  return (
    <div className={`ordino-start-menu tab-content ${props.active ? 'ordino-start-menu-open' : ''}`}>
      {props.tabs.map((tab, index) => (
        <div className={`tab-pane fade ${props.active === tab ? `active show` : ''}`}
          key={tab.id}
          id={tab.id}
          role="tabpanel"
          aria-labelledby={`${tab.id}-tab`}
        >
          {index === 0 ? <DatasetsTab /> : null}
          {index === 1 ? <SessionsTab /> : null}
          {index === 2 ? <ToursTab /> : null}
        </div>
      ))}
    </div>
  );
}
