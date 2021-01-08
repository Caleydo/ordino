import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppHeader} from 'phovea_ui';
import {BaseUtils} from 'phovea_core';

interface IStartMenuTab {
  id: string;
  title: string;
  key?: string;
}

const startMenuContext = React.createContext(null);

function StartMenuProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);

  const store = {
    open,
    setOpen,
    active,
    setActive,
  };

  return (
    <startMenuContext.Provider value={store}>{children}</startMenuContext.Provider>
  );
}

export function StartMenuWrapper(parentElement, header: AppHeader) {
  let tabs: IStartMenuTab[] = [
    { id: 'datasets', title: 'Datasets' },
    { id: 'sessions', title: 'Analysis Sessions' },
    { id: 'tours', title: 'Tours' },
  ];

  tabs = tabs.map((tab) => {
    tab.key = `${tab.id}-${BaseUtils.randomId(3)}`;
    return tab;
  });

  // TODO: two indpendent ReactDOM.render() seem to be odd -> is there a better way?
  ReactDOM.render(
    <StartMenuProvider>
      <MainMenuLinks tabs={tabs}></MainMenuLinks>
    </StartMenuProvider>,
    header.mainMenu
  );

  return ReactDOM.render(
    <StartMenuProvider>
      {/* <ul> <!-- update works as long as the consumer is nested in the provider !-->
        <MainMenuLinks tabs={tabs}></MainMenuLinks>
      </ul> */}
      <StartMenu tabs={tabs}></StartMenu>
    </StartMenuProvider>,
    parentElement
  );
}

interface IStartMenuTabProps {
  tabs: IStartMenuTab[];
}

function StartMenu(props: IStartMenuTabProps) {
  const {open, active} = React.useContext(startMenuContext);
  console.log(active, open);

  return (
    <div className={`ordino-start-menu tab-content ${open ? 'ordino-start-menu-open' : ''}`}>
      {props.tabs.map((tab) => (
        <div className={`tab-pane fade ${active === tab ? `active show` : ''}`} id={tab.key} role="tabpanel" aria-labelledby={`${tab.key}-tab`} key={tab.id}>{tab.title}</div>
      ))}
    </div>
  );
}


function MainMenuLinks(props: IStartMenuTabProps) {
  const {active, setActive, open, setOpen} = React.useContext(startMenuContext);

  return (
    <>
      {props.tabs.map((tab) => (
        <li className="nav-item" key={tab.key}>
          <a className="nav-link"
            href={`#${tab.key}`}
            id={`${tab.key}-tab`}
            role="tab"
            aria-controls={tab.key}
            aria-selected={(active === tab)}
            onClick={(evt) => {
              evt.preventDefault();
              console.log(open, active);
              setOpen(!open);
              setActive(tab);
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
