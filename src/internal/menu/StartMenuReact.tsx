import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CLUEGraphManager} from 'phovea_clue';
import {GlobalEventHandler, ProvenanceGraph} from 'phovea_core';
import {Ordino} from '../..';
import {DatasetsTab, SessionsTab, ToursTab} from './tabs';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {AppHeader} from 'phovea_ui';


export enum EStartMenuMode {
  /**
   * no analysis in the background, the start menu cannot be closed
   */
  START = 'start',

  /**
   * an analysis in the background, the start menu can be closed
   */
  OVERLAY = 'overlay'
}

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
   */
  mode: EStartMenuMode;
}

const tabs: IStartMenuTab[] = [
  {id: 'datasets', title: 'Datasets'},
  {id: 'sessions', title: 'Analysis Sessions'},
  {id: 'tours', title: 'Tours'},
];

// tslint:disable-next-line: variable-name
export const GraphContext = React.createContext<{graph: ProvenanceGraph, manager: CLUEGraphManager}>({graph: null, manager: null});

export function StartMenuComponent({header, manager, graph, mode}: {header: AppHeader, manager: CLUEGraphManager, graph: ProvenanceGraph, mode: EStartMenuMode}) {
  const [active, setActive] = React.useState((mode === EStartMenuMode.START) ? tabs[0] : null); // first tab in overlay mode OR close all tabs in overlay mode

  React.useEffect(() => {
    const listener = () => setActive(tabs[0]);
    GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);

    return () => {
      GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
    };
  }, []);

  React.useEffect(() => {
    // switch header to dark theme when a tab is active
    header.toggleDarkTheme((active) ? true : false);
  }, [header, active]);

  return (
    <>
      {ReactDOM.createPortal(
        <MainMenuLinks tabs={tabs} active={active} setActive={(a) => setActive(a)} mode={mode}></MainMenuLinks>,
        header.mainMenu
      )}
      <GraphContext.Provider value={{manager, graph}}>
        <StartMenuTabs tabs={tabs} active={active} setActive={setActive} mode={mode}></StartMenuTabs>
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
              if (props.mode === EStartMenuMode.OVERLAY && props.active === tab) {
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


function StartMenuTabs(props: IStartMenuTabProps) {
  return (
    <div className={`ordino-start-menu tab-content ${props.active ? 'ordino-start-menu-open' : ''}`}>
      {props.tabs.map((tab, index) => (
        <div className={`tab-pane fade ${props.active === tab ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`}
          key={tab.id}
          id={tab.id}
          role="tabpanel"
          aria-labelledby={`${tab.id}-tab`}
        >
          {props.mode === EStartMenuMode.OVERLAY &&
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
