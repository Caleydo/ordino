import {IProvenanceGraphDataDescription, I18nextManager} from 'phovea_core';
import React from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import {ProvenanceGraphMenuUtils} from 'tdp_core';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../OrdinoAppComponent';
import {ListItemDropdown} from '../common';
import {CommonSessionCard} from './CommonSessionCard';
import {SessionListItem} from './SessionListItem';
import {byDateDesc} from './utils';

export function TemporarySessionCard() {
    const [tempSessions, setTempSessions] = React.useState<IProvenanceGraphDataDescription[]>(null);
    const {manager} = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => async () => {
        const tempSessions = (await manager.list())?.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setTempSessions(tempSessions);
    }, []);

    // TODO the status, error should not be passed to the children
    const {status, error} = useAsync(listSessions);

    return (
        <>
            <CommonSessionCard cardName="Temporary Sessions" faIcon="fa-history" cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tempCardInfo')}>
                {(exportSession, cloneSession, saveSession, deleteSession) => {
                    return <> {
                        tempSessions?.map((session) => {
                            return <SessionListItem key={session.id} status={status} desc={session} error={error}>
                                <Button variant="outline-secondary" className="mr-2 pt-1 pb-1" onClick={(event) => saveSession(event, session)}>Save</Button>
                                <ListItemDropdown>
                                    <Dropdown.Item onClick={(event) => cloneSession(event, session)}>Clone</Dropdown.Item>
                                    <Dropdown.Item onClick={(event) => exportSession(event, session)}>Export</Dropdown.Item>
                                    <Dropdown.Item className="dropdown-delete" onClick={(event) => deleteSession(event, session, setTempSessions)}>Delete</Dropdown.Item>
                                </ListItemDropdown>
                            </SessionListItem>;
                        })
                    }
                    </>;
                }}
            </CommonSessionCard>
        </>
    );
}
