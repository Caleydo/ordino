import {IProvenanceGraphDataDescription, I18nextManager} from 'tdp_core';
import React from 'react';
import {ProvenanceGraphMenuUtils, useAsync} from 'tdp_core';
import {IStartMenuSessionSectionDesc} from '../../..';
import {GraphContext} from '../../OrdinoApp';
import {ListItemDropdown} from '../../../components';
import {EAction, CommonSessionCard} from './CommonSessionCard';
import {SessionListItem} from './SessionListItem';
import {byDateDesc} from './utils';



export default function TemporarySessionCard({name, faIcon}: IStartMenuSessionSectionDesc) {
    const {manager} = React.useContext(GraphContext);
    const [sessions, setSessions] = React.useState<IProvenanceGraphDataDescription[]>(null);

    const listSessions = React.useMemo(() => async () => {
        const all = (await manager.list())?.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setSessions(all);
    }, []);

    const {status} = useAsync(listSessions, []);

    return (
        <>
            <CommonSessionCard cardName={name} faIcon={faIcon} cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tempCardInfo')}>
                {(sessionAction) => {
                    return <div className="position-relative">
                        <div className="ordino-session-list p-1">
                            {status === 'pending' &&
                                <p><i className="fas fa-circle-notch fa-spin"></i> {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingSets')}</p>
                            }
                            {status === 'success' &&
                                sessions.length === 0 &&
                                <p>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.noSetsAvailable')}</p>
                            }
                            {
                                status === 'success' && sessions.length > 0 &&
                                sessions?.map((session) => {
                                    return <SessionListItem key={session.id} desc={session} selectSession={(event) => sessionAction(EAction.SELECT, event, session)}>
                                        <button type="button" data-testid="save-button" className="me-2 pt-1 pb-1 btn btn-outline-secondary" title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.saveSession')} onClick={(event) => sessionAction(EAction.SAVE, event, session)}>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.save')}</button>
                                        <ListItemDropdown>
                                            <button type="button" data-testid="clone-button" className="dropdown-item" title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneToTemporary')} onClick={(event) => sessionAction(EAction.CLONE, event, session)}>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.clone')}</button>
                                            <button type="button" data-testid="delete-button" className="dropdown-delete dropdown-item" title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.deleteSession')} onClick={(event) => sessionAction(EAction.DELETE, event, session, setSessions)}>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete')}</button>
                                        </ListItemDropdown>
                                    </SessionListItem>;
                                })
                            }
                            {status === 'error' && <p>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingError')}</p>}
                        </div>
                    </div>;
                }}
            </CommonSessionCard>
        </>
    );
}
