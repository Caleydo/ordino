import React from 'react';

import { EStartMenuMode } from '../constants';

import type { IStartMenuTabWrapperProps } from '../interfaces';

export function StartMenuTabWrapper(props: IStartMenuTabWrapperProps) {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {props.status === 'success' && (
        <div
          id="ordino-start-menu"
          className={`ordino-start-menu tab-content ${props.activeTab ? 'ordino-start-menu-open' : 'd-none'} ${
            props.mode === EStartMenuMode.OVERLAY ? 'ordino-start-menu-overlay' : ''
          }`}
        >
          {props.tabs.map((tab) => (
            <div
              className={`tab-pane fade ${props.activeTab === tab ? `active show` : ''} ${props.mode === EStartMenuMode.START ? `pt-5` : ''}`}
              key={tab.desc.id}
              id={tab.desc.id}
              role="tabpanel"
              aria-labelledby={`${tab.desc.id}-tab`}
              data-testid={tab.desc.id}
            >
              {props.mode === EStartMenuMode.OVERLAY && (
                <div className="container-fluid">
                  <div className="row">
                    <div className="col position-relative d-flex justify-content-end">
                      {
                        // eslint-disable-next-line react/self-closing-comp, prettier/prettier
                      }<button
                        type="button"
                        className="btn-close"
                        data-testid="close-button"
                        onClick={() => {
                          props.setActiveTab(null);
                        }}
                      ></button>
                    </div>
                  </div>
                </div>
              )}
              <tab.factory isActive={props.activeTab === tab} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
