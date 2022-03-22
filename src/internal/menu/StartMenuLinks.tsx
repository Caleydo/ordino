import React from 'react';

import { EStartMenuMode } from '../constants';

import type { IStartMenuTabWrapperProps } from '../interfaces';

export function StartMenuLinks(props: IStartMenuTabWrapperProps) {
  return (
    <>
      {props.status === 'success' &&
        props.tabs.map((tab) => (
          <li className={`nav-item ${props.activeTab === tab ? 'active' : ''}`} key={tab.desc.id}>
            <a
              className="nav-link"
              href={`#${tab.desc.id}`}
              id={`${tab.desc.id}-tab`}
              data-testid={`${tab.desc.id}-tab`}
              role="tab"
              aria-controls={tab.desc.id}
              aria-selected={props.activeTab === tab}
              onClick={(evt) => {
                evt.preventDefault();
                if (props.mode === EStartMenuMode.OVERLAY && props.activeTab === tab) {
                  // remove :focus from link to remove highlight color
                  evt.currentTarget.blur();

                  // close tab only in overlay mode
                  props.setActiveTab(null);
                } else {
                  props.setActiveTab(tab);
                }

                return false;
              }}
            >
              {tab.desc.icon ? <i className={tab.desc.icon} /> : null}
              {tab.desc.text}
            </a>
          </li>
        ))}{' '}
    </>
  );
}
