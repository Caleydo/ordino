import {I18nextManager, IProvenanceGraphDataDescription, UserSession, UniqueIdManager} from 'phovea_core';
import React from 'react';
import {ProvenanceGraphMenuUtils} from 'tdp_core';
import {IStartMenuSessionSectionDesc} from '../../..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../OrdinoApp';
import {ListItemDropdown} from '../../../components';
import {EAction, CommonSessionCard} from './CommonSessionCard';
import {SessionListItem} from './SessionListItem';
import {byDateDesc} from './utils';


export default function SavedSessionCard({name, faIcon}: IStartMenuSessionSectionDesc) {
  const {manager} = React.useContext(GraphContext);
  const [sessions, setSessions] = React.useState<IProvenanceGraphDataDescription[]>(null);

  const listSessions = React.useMemo(() => async () => {
    const all = (await manager.list())?.filter((d) => ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
    setSessions(all);
  }, []);

  const me = UserSession.getInstance().currentUserNameOrAnonymous();
  const savedSessions = sessions?.filter((d) => d.creator === me);
  const otherSessions = sessions?.filter((d) => d.creator !== me);

  const {status} = useAsync(listSessions);

  const id = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);

  return (
    <>
      <p className="lead text-ordino-gray-4 mb-4">Load a previous analysis session</p>
      <CommonSessionCard cardName={name} faIcon={faIcon} cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.savedCardInfo')}>
        {(sessionAction) => {
          return <>
            <ul className="nav nav-pills session-tab card-header-pills"  role="tablist">
              <li className="nav-item" role="presentation">
                <a className="nav-link active" id={`saved-session-tab-${id}`} data-toggle="tab" href={`#saved-session-mine-panel-${id}`} role="tab" aria-controls={`saved-session-mine-panel-${id}`} aria-selected="true">
                <i className="me-2 fas fa-user"></i>My sessions
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a className="nav-link" id={`saved-session-other-tab-${id}`} data-toggle="tab" href={`#saved-session-other-panel-${id}`} role="tab" aria-controls={`saved-session-other-panel-${id}`} aria-selected="false">
                <i className="me-2 fas fa-users"></i>Public sessions
                </a>
              </li>
            </ul>
            <div className="row pt-4">
              <div className="col position-relative">
                <div className="tab-content">
                  <div className="tab-pane fade show active" role="tabpanel" id={`saved-session-mine-panel-${id}`} aria-labelledby={`saved-session-mine-tab-${id}`}>
                    {status === 'pending' &&
                      <p><i className="fas fa-circle-notch fa-spin"></i> Loading sets...</p>
                    }
                    {status === 'success' &&
                      savedSessions.length === 0 &&
                      <p>No sets available</p>
                    }
                    {
                      status === 'success' && savedSessions.length > 0 &&
                      savedSessions?.map((session) => {
                        return <SessionListItem key={session.id} desc={session} selectSession={(event) => sessionAction(EAction.SELECT, event, session)}>
                          <button onClick={(event) => sessionAction(EAction.EDIT, event, session, setSessions)} className="me-2 pt-1 pb-1 btn btn-outline-secondary">Edit</button>
                          <ListItemDropdown>
                            <button className="dropdown-item" title="Clone to Temporary Session" onClick={(event) => sessionAction(EAction.CLONE, event, session)}>
                              Clone
                            </button>
                            <button className="dropdown-item dropdown-delete" onClick={(event) => sessionAction(EAction.DELETE, event, session, setSessions)}>
                              Delete
                            </button>
                          </ListItemDropdown>
                        </SessionListItem>;
                      })}
                    {status === 'error' && <p>Error when loading sets</p>}
                  </div>

                  <div className="tab-pane fade" role="tabpanel" id={`saved-session-other-panel-${id}`} aria-labelledby={`saved-session-other-tab-${id}`}>
                    {status === 'pending' &&
                      <p><i className="fas fa-circle-notch fa-spin"></i> Loading sets...</p>
                    }
                    {status === 'success' &&
                      otherSessions.length === 0 &&
                      <p>No sets available</p>
                    }
                    {
                      status === 'success' && otherSessions.length > 0 &&
                      otherSessions?.map((session) => {
                        return <SessionListItem key={session.id} desc={session}>
                          <button title="Clone to Temporary Session" onClick={(event) => sessionAction(EAction.CLONE, event, session)} className="me-2 pt-1 pb-1 btn btn-outline-secondary">Clone</button>
                        </SessionListItem>;
                      })}
                    {status === 'error' && <p>Error when loading sets</p>}
                  </div>
                </div>
              </div>
            </div>
          </>;
        }}
      </CommonSessionCard>
    </>
  );
}
