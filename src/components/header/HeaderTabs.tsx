import React from 'react';
import {useDispatch} from 'react-redux';
import {setActiveTab} from '../../store';
import {IStartMenuTabWrapperProps, EStartMenuMode} from './menu/StartMenuTabWrapper';

export function HeaderTabs(props: IStartMenuTabWrapperProps) {
  const dispatch = useDispatch();

  return (
    <>
      <ul className="navbar-nav me-auto align-items-center">
        {props.tabs.map((tab) => (
          <li className={`nav-item ${props.activeTab === tab.id ? 'active' : ''}`} key={tab.id}>
            <a className="nav-link"
              href={`#${tab.id}`}
              id={`${tab.id}-tab`}
              role="tab"
              aria-controls={tab.id}
              aria-selected={(props.activeTab === tab.id)}
              onClick={(evt) => {
                evt.preventDefault();
                if (props.mode === EStartMenuMode.OVERLAY && props.activeTab === tab.id) {
                  // remove :focus from link to remove highlight color
                  evt.currentTarget.blur();

                  // close tab only in overlay mode
                  dispatch(setActiveTab(null));
                } else {
                  dispatch(setActiveTab(tab.id));
                }

                return false;
              }}
            >
              {tab.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}