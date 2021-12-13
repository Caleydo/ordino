import {I18nextManager, IProvenanceGraphDataDescription} from 'tdp_core';
import React from 'react';
import {ProvenanceGraphMenuUtils, TDPApplicationUtils} from 'tdp_core';
import {SessionAction} from './CommonSessionCard';


interface ISessionListItemProps {
  desc: IProvenanceGraphDataDescription | null;
  /**
   * Opens the session. If not provided then the session can only be cloned to a temporary session.
   */
  selectSession?: SessionAction;
  children?: React.ReactNode;
}

export function SessionListItem({desc, selectSession, children}: ISessionListItemProps) {
  const dateString = desc.ts ? new Date(desc.ts).toUTCString() : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
  const dateFromNow = desc?.ts ? TDPApplicationUtils.fromNow(desc.ts) : I18nextManager.getInstance().i18n.t('tdp:core.SessionList.unknown');
  return (
    <>
      <div className="row dropdown-parent session-item ms-0 mb-1 me-1 align-items-start" data-testid={desc.id}>
        <div className="d-flex px-0 flex-column align-items-start col-md-11">
          <button type="button" title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.continueSession')} data-testid={'continueSession-button'} disabled={selectSession == null} className="ps-0 btn btn-link align-self-start text-ordino-button-primary" onClick={(event) => selectSession(event, desc)}>
            <i className={`me-2 fas ${desc.local ? 'fa-history' : 'fa-cloud'}`}></i>
            {desc.name}
          </button>
          {desc.description ? <p className="ms-4">{desc.description} </p> : null}
          <div className="pe-0 align-self-stretch row">
            <div className="col position-relative">
              {dateFromNow ? <p className="flex-grow-1 ms-4 text-muted" title={dateString}>{dateFromNow} </p> : null}
            </div>
            {desc.local ? null :
              <div className="col position-relative">
                {ProvenanceGraphMenuUtils.isPublic(desc) ?
                  <p className="text-muted flex-grow-1" title={I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status')}>
                    <i className="me-2 fas fa-users"></i>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.publicAccess')}
                  </p> :
                  <p className="text-muted flex-grow-1" title={I18nextManager.getInstance().i18n.t('tdp:core.SessionList.status', {context: 'private'})}>
                    <i className="me-2 fas fa-user"></i>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.privateAccess')}
                  </p>}
              </div>
            }
          </div>
        </div>
        <div className="d-flex px-0 mt-1 justify-content-end col-md-1">
          {children}
        </div>
      </div>
    </>
  );
}
