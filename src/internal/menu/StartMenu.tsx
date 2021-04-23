import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GlobalEventHandler} from 'phovea_core';
import {Ordino} from '../..';
import {DatasetsTab, SessionsTab, ToursTab} from './tabs';
import {Button, Col, Container, Row} from 'react-bootstrap';
import {AppHeader} from 'phovea_ui';
import {HighlightSessionCardContext} from '../OrdinoApp';


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

export enum EStartMenuOpen {
  /**
   * no analysis in the background, the start menu cannot be closed
   */
  OPEN = 'open',

  /**
   * an analysis in the background, the start menu can be closed
   */
  CLOSED = 'closed'
}

interface IStartMenuTab {
  id: string;
  title: string;
  // TODO: create an extension point to add additional tabs
  factory: () => JSX.Element;
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
  activeTab: IStartMenuTab;

  /**
   * Set the active tab
   * `null` closes all tabs
   */
  setActiveTab: React.Dispatch<React.SetStateAction<IStartMenuTab>>;

  /**
   * Define the mode of the start menu
   */
  mode: EStartMenuMode;
}

const tabs: IStartMenuTab[] = [
  {id: 'datasets', title: 'Datasets', factory: DatasetsTab},
  {id: 'sessions', title: 'Analysis Sessions', factory: SessionsTab},
  {id: 'tours', title: 'Tours', factory: ToursTab},
];


export function StartMenuComponent({header, mode, open}: {header: AppHeader, mode: EStartMenuMode, open: EStartMenuOpen}) {
  // no active tab until `open` is set OR a link in the header navigation is clicked
  const [activeTab, setActiveTab] = React.useState(null);
  const [highlight, setHighlight] = React.useState(false);

  React.useEffect(() => {
    // legacy event from ATDPApplication
    const listener = () => setActiveTab(tabs[0]);
    GlobalEventHandler.getInstance().on(Ordino.EVENT_OPEN_START_MENU, listener);

    return () => {
      GlobalEventHandler.getInstance().off(Ordino.EVENT_OPEN_START_MENU, listener);
    };
  }, []);

  React.useEffect(() => {
    // set the active tab when the start menu should be opened
    setActiveTab((open === EStartMenuOpen.OPEN) ? tabs[0] : null);
  }, [open]);

  React.useEffect(() => {
    // switch header to dark theme when a tab is active
    header.toggleDarkTheme((activeTab) ? true : false);
  }, [header, activeTab]);


  React.useEffect(() => {
    let link = header.rightMenu.querySelector('*[data-header="currentAnalysisSession"]');
    if (!link) {
      link = header.addRightMenu('Current session', (event) => {
        event.preventDefault();
        setActiveTab(tabs[1]); // TODO: find better way to identify the tabs
        setHighlight(true); // TODO: set highlight back to false
      });

      link.firstElementChild.innerHTML = '<i class="fas fa-history mr-2"></i>Current Analysis Session';
      link.setAttribute('data-header', 'currentAnalysisSession');
      link.classList.add('hidden');
    }

    link.toggleAttribute('hidden', (activeTab) ? true : false);
  }, [header, activeTab]);

  return (
    <>
      {ReactDOM.createPortal(
        <MainMenuLinks tabs={tabs} activeTab={activeTab} setActiveTab={(a) => setActiveTab(a)} mode={mode}></MainMenuLinks>,
        header.mainMenu
      )}
      <HighlightSessionCardContext.Provider value={{highlight}}>
        <StartMenuTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} mode={mode}></StartMenuTabs>
      </HighlightSessionCardContext.Provider>
    </>
  );
}

function MainMenuLinks(props: IStartMenuTabProps) {
  return (
    <>
      {props.tabs.map((tab) => (
        <li className={`nav-item ${props.activeTab === tab ? 'active' : ''}`} key={tab.id}>
          <a className="nav-link"
            href={`#${tab.id}`}
            id={`${tab.id}-tab`}
            role="tab"
            aria-controls={tab.id}
            aria-selected={(props.activeTab === tab)}
            onClick={(evt) => {
              evt.preventDefault();
              if (props.mode === EStartMenuMode.OVERLAY && props.activeTab === tab) {
                // close tab only in overlay mode
                props.setActiveTab(null);
              } else {
                props.setActiveTab(tab);
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
  if (props.activeTab === null) {
    return null;
  }

  return (
    <div id="ordino-start-menu" className={`ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : ''}`}>
      {props.tabs.map((tab) => (
        <div className={`tab-pane fade ${props.activeTab === tab ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`}
          key={tab.id}
          id={tab.id}
          role="tabpanel"
          aria-labelledby={`${tab.id}-tab`}
        >
          {props.mode === EStartMenuMode.OVERLAY &&
            <Container fluid>
              <Row>
                <Col className="d-flex justify-content-end">
                  <Button className="start-menu-close" variant="link" onClick={() => {props.setActiveTab(null);}}>
                    <i className="fas fa-times"></i>
                  </Button>
                </Col>
              </Row>
            </Container>
          }
          <tab.factory />
        </div>
      ))}
    </div>
  );
}
