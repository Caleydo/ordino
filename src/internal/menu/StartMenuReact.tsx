import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IStartMenuTab {
  id: string;
  title: string;
}

interface IStartMenuTabProps {
  tabs: IStartMenuTab[];
  active: IStartMenuTab;
  setActive: React.Dispatch<React.SetStateAction<IStartMenuTab>>;
}

const tabs: IStartMenuTab[] = [
  { id: 'datasets', title: 'Datasets' },
  { id: 'sessions', title: 'Analysis Sessions' },
  { id: 'tours', title: 'Tours' },
];

export function StartMenuComponent({headerMainMenu}: { headerMainMenu: HTMLElement }) {
  const [active, setActive] = React.useState(null);
  return (
    <>
      {ReactDOM.createPortal(
        <MainMenuLinks tabs={tabs} active={active} setActive={setActive}></MainMenuLinks>,
        headerMainMenu
      )}
      <StartMenu tabs={tabs} active={active} setActive={setActive}></StartMenu>
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
              if(props.active === tab) {
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
      {props.tabs.map((tab) => (
        <div className={`tab-pane fade ${props.active === tab ? `active show` : ''}`}
          key={tab.id}
          id={tab.id}
          role="tabpanel"
          aria-labelledby={`${tab.id}-tab`}
        >
          {tab.title}
        </div>
      ))}
    </div>
  );
}
