import { I18nextManager, IProvenanceGraphDataDescription, UserSession, UniqueIdManager, ProvenanceGraphMenuUtils, useAsync } from 'tdp_core';
import React from 'react';

import { GraphContext } from '../../constants';
import { ListItemDropdown } from '../../../components';
import { EAction, CommonSessionCard } from './CommonSessionCard';
import { SessionListItem } from './SessionListItem';
import { byDateDesc } from './utils';

import type { IStartMenuSessionSectionDesc } from '../../../base/extensions';

export default function SavedSessionCard({ name, faIcon }: IStartMenuSessionSectionDesc) {
  const { manager } = React.useContext(GraphContext);
  const [sessions, setSessions] = React.useState<IProvenanceGraphDataDescription[]>(null);

  const listSessions = React.useMemo(
    () => async () => {
      const all = (await manager.list())?.filter((d) => ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
      setSessions(all);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const me = UserSession.getInstance().currentUserNameOrAnonymous();
  const savedSessions = sessions?.filter((d) => d.creator === me);
  const otherSessions = sessions?.filter((d) => d.creator !== me);

  const { status } = useAsync(listSessions, []);

  const id = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);

  return (
    <>
      <p className="lead text-gray-600 mb-4">Load a previous analysis session</p>
      <CommonSessionCard cardName={name} faIcon={faIcon} cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.savedCardInfo')}>
        {(sessionAction) => {
          return (
            <>
              <ul className="nav nav-pills session-tab card-header-pills" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link active"
                    id={`saved-session-tab-${id}`}
                    data-bs-toggle="tab"
                    data-testid="my-sessions-link"
                    href={`#saved-session-mine-panel-${id}`}
                    role="tab"
                    aria-controls={`saved-session-mine-panel-${id}`}
                    aria-selected="true"
                  >
                    <i className="me-2 fas fa-user" />
                    {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.mySessions')}
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id={`saved-session-other-tab-${id}`}
                    data-bs-toggle="tab"
                    data-testid="other-sessions-link"
                    href={`#saved-session-other-panel-${id}`}
                    role="tab"
                    aria-controls={`saved-session-other-panel-${id}`}
                    aria-selected="false"
                  >
                    <i className="me-2 fas fa-users" />
                    {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.otherSessions')}
                  </a>
                </li>
              </ul>
              <div className="row pt-4">
                <div className="col">
                  <div className="tab-content position-relative">
                    <div
                      className="tab-pane fade show active ordino-session-list p-1"
                      role="tabpanel"
                      id={`saved-session-mine-panel-${id}`}
                      data-testid="my-sessions"
                      aria-labelledby={`saved-session-mine-tab-${id}`}
                    >
                      {status === 'pending' && (
                        <p>
                          <i className="fas fa-circle-notch fa-spin" /> {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingSets')}
                        </p>
                      )}
                      {status === 'success' && savedSessions.length === 0 && (
                        <p>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.noSetsAvailable')}</p>
                      )}
                      {status === 'success' &&
                        savedSessions.length > 0 &&
                        savedSessions?.map((session) => {
                          return (
                            <SessionListItem key={session.id} desc={session} selectSession={(event) => sessionAction(EAction.SELECT, event, session)}>
                              <button
                                type="button"
                                title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.editDetails')}
                                data-testid="edit-button"
                                onClick={(event) => sessionAction(EAction.EDIT, event, session, setSessions)}
                                className="me-2 pt-1 pb-1 btn btn-outline-secondary"
                              >
                                {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.edit')}
                              </button>
                              <ListItemDropdown>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  data-testid="clone-button"
                                  title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneToTemporary')}
                                  onClick={(event) => sessionAction(EAction.CLONE, event, session)}
                                >
                                  {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.clone')}
                                </button>
                                <button
                                  type="button"
                                  title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.deleteSession')}
                                  className="dropdown-item dropdown-delete"
                                  data-testid="delete-button"
                                  onClick={(event) => sessionAction(EAction.DELETE, event, session, setSessions)}
                                >
                                  {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete')}
                                </button>
                              </ListItemDropdown>
                            </SessionListItem>
                          );
                        })}
                      {status === 'error' && <p>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingError')}</p>}
                    </div>

                    <div
                      className="tab-pane fade ordino-session-list p-1"
                      role="tabpanel"
                      id={`saved-session-other-panel-${id}`}
                      aria-labelledby={`saved-session-other-tab-${id}`}
                    >
                      {status === 'pending' && (
                        <p>
                          <i className="fas fa-circle-notch fa-spin" /> {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingSets')}
                        </p>
                      )}
                      {status === 'success' && otherSessions.length === 0 && (
                        <p>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.noSetsAvailable')}</p>
                      )}
                      {status === 'success' &&
                        otherSessions.length > 0 &&
                        otherSessions?.map((session) => {
                          return (
                            <SessionListItem key={session.id} desc={session}>
                              <button
                                type="button"
                                title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneToTemporary')}
                                onClick={(event) => sessionAction(EAction.CLONE, event, session)}
                                className="me-2 pt-1 pb-1 btn btn-outline-secondary"
                              >
                                Clone
                              </button>
                            </SessionListItem>
                          );
                        })}
                      {status === 'error' && <p>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingError')}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </CommonSessionCard>
    </>
  );
}
