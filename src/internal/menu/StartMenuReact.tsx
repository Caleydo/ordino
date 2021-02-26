import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CLUEGraphManager} from 'phovea_clue';
import {GlobalEventHandler, ProvenanceGraph} from 'phovea_core';
import {Ordino} from '../..';
import {DatasetsTab, SessionsTab, ToursTab} from './tabs';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {AppHeader} from 'phovea_ui';


export type StartMenuMode = 'start' | 'overlay';

interface IStartMenuTab {
  id: string;
  title: string;
}

interface IStartMenuTabProps {
  /**
   * List of tabs
   */
  tabs: IStartMenuTab[];

  /**
   * The currently active (i.e., visible tab)
   * `null` = all tabs are closed
   */
  active: IStartMenuTab;

  /**
   * Set the active tab
   * `null` closes all tabs
   */
  setActive: React.Dispatch<React.SetStateAction<IStartMenuTab>>;

  /**
   * Define the mode of the start menu
   * `start` = no analysis in the background, the start menu cannot be closed
   * `overlay` = an analysis in the background, the start menu can be closed
   */
  mode: StartMenuMode;
}

const tabs: IStartMenuTab[] = [
  {id: 'datasets', title: 'Datasets'},
  {id: 'sessions', title: 'Analysis Sessions'},
  {id: 'tours', title: 'Tours'},
];

// tslint:disable-next-line: variable-name
export const GraphContext = React.createContext<{graph: ProvenanceGraph, manager: CLUEGraphManager}>({graph: null, manager: null});

export function StartMenuComponent({header, manager, graph, modePromise}: {header: AppHeader, manager: CLUEGraphManager, graph: ProvenanceGraph, modePromise: Promise<StartMenuMode>}) {
  const [mode, setMode] = React.useState<'start'|'overlay'>('start');
  const [active, setActive] = React.useState(null); // first tab in overlay mode OR close all tabs in overlay mode

  React.useEffect(() => {
    const listener = () => setActive(tabs[0]);
    GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);

    return () => {
      GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
    };
  }, []);

  React.useEffect(() => {
    modePromise.then((mode) => {
      console.log('set mode', mode);
      setMode(mode);
      setActive((mode === 'start') ? tabs[0] : null);
    });
  }, [modePromise]);

  React.useEffect(() => {
    // switch header to dark theme when a tab is active
    header.toggleDarkTheme((active) ? true : false);
  }, [header, active]);

  console.log('start menu component');

  return (
    <>
      {ReactDOM.createPortal(
        <MainMenuLinks tabs={tabs} active={active} setActive={(a) => setActive(a)} mode={mode}></MainMenuLinks>,
        header.mainMenu
      )}
      <GraphContext.Provider value={{manager, graph}}>
        <StartMenu tabs={tabs} active={active} setActive={setActive} mode={mode}></StartMenu>
      </GraphContext.Provider>
    </>
  );
}

function MainMenuLinks(props: IStartMenuTabProps) {
  return (
    <>
      {props.tabs.map((tab) => (
        <li className={`nav-item ${props.active === tab ? 'active' : ''}`} key={tab.id}>
          <a className="nav-link"
            href={`#${tab.id}`}
            id={`${tab.id}-tab`}
            role="tab"
            aria-controls={tab.id}
            aria-selected={(props.active === tab)}
            onClick={(evt) => {
              evt.preventDefault();
              window.scrollTo(0, 0);
              if (props.mode === 'overlay' && props.active === tab) {
                // close tab only in overlay mode
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
        <div className={`tab-pane fade ${props.active === tab ? `active show` : ''} ${props.mode === 'start' ? `pt-5` : ''}`}
          key={tab.id}
          id={tab.id}
          role="tabpanel"
          aria-labelledby={`${tab.id}-tab`}
        >
          {props.mode === 'overlay' &&
          <Container fluid>
            <Row>
              <Col className="d-flex justify-content-end">
                <Button className="start-menu-close" variant="link" onClick={() => { props.setActive(null); }}>
                  <i className="fas fa-times"></i>
                </Button>
              </Col>
            </Row>
          </Container>}
          {index === 0 ? <DatasetsTab /> : null}
          {index === 1 ? <SessionsTab /> : null}
          {index === 2 ? <ToursTab /> : null}
        </div>
      ))}
    </div>
  );
}
