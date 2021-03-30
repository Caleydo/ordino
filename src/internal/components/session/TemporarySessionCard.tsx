import {IProvenanceGraphDataDescription, I18nextManager} from 'phovea_core';
import React from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import {ProvenanceGraphMenuUtils} from 'tdp_core';
import {IStartMenuSessionSectionDesc} from '../../..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../OrdinoApp';
import {ListItemDropdown} from '../common';
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

    const {status} = useAsync(listSessions);

    return (
        <>
            <CommonSessionCard cardName={name} faIcon={faIcon} cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tempCardInfo')}>
                {(sessionAction) => {
                    return <>
                        {status === 'pending' &&
                            <p><i className="fas fa-circle-notch fa-spin"></i> Loading sets...</p>
                        }
                        {status === 'success' &&
                            sessions.length === 0 &&
                            <p>No sets available</p>
                        }
                        {
                            status === 'success' && sessions.length > 0 &&
                            sessions?.map((session) => {
                                return <SessionListItem key={session.id} desc={session} selectSession={(event) => sessionAction(EAction.SELECT, event, session)}>
                                    <Button variant="outline-secondary" className="mr-2 pt-1 pb-1" onClick={(event) => sessionAction(EAction.SAVE, event, session)}>Save</Button>
                                    <ListItemDropdown>
                                        <Dropdown.Item onClick={(event) => sessionAction(EAction.CLONE, event, session)}>Clone</Dropdown.Item>
                                        <Dropdown.Item className="dropdown-delete" onClick={(event) => sessionAction(EAction.DELETE, event, session, setSessions)}>Delete</Dropdown.Item>
                                    </ListItemDropdown>
                                </SessionListItem>;
                            })
                        }
                        {status === 'error' && <p>Error when loading sets</p>}
                    </>;
                }}
            </CommonSessionCard>
        </>
    );
}
