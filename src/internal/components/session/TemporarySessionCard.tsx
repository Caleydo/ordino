import {IProvenanceGraphDataDescription, I18nextManager} from 'phovea_core';
import React from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import {ProvenanceGraphMenuUtils} from 'tdp_core';
import {IStartMenuSectionDesc} from '../../..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';
import {byDateDesc} from '../../menu/tabs/SessionsTab';
import {ListItemDropdown} from '../common';
import {Action, CommonSessionCard} from './CommonSessionCard';
import {SessionListItem} from './SessionListItem';



export default function TemporarySessionCard({name, faIcon, cssClass}: IStartMenuSectionDesc) {
    const {app} = React.useContext(GraphContext);
    const [sessions, setSessions] = React.useState<IProvenanceGraphDataDescription[]>(null);

    const listSessions = React.useMemo(() => async () => {
        const all = (await app.graphManager.list())?.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
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
                                return <SessionListItem key={session.id} desc={session} selectSession={(event) => sessionAction(Action.SELECT, event, session)}>
                                    <Button variant="outline-secondary" className="mr-2 pt-1 pb-1" onClick={(event) => sessionAction(Action.SAVE, event, session)}>Save</Button>
                                    <ListItemDropdown>
                                        <Dropdown.Item onClick={(event) => sessionAction(Action.CLONE, event, session)}>Clone</Dropdown.Item>
                                        <Dropdown.Item onClick={(event) => sessionAction(Action.EXPORT, event, session)}>Export</Dropdown.Item>
                                        <Dropdown.Item className="dropdown-delete" onClick={(event) => sessionAction(Action.DELETE, event, setSessions)}>Delete</Dropdown.Item>
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
