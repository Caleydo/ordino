import {IProvenanceGraphDataDescription, I18nextManager} from 'phovea_core';
import React, {useRef} from 'react';
import {Button, Card, Dropdown} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ErrorAlertHandler, FormDialog, NotificationHandler, ProvenanceGraphMenuUtils} from 'tdp_core';
import {ListItemDropdown, SessionListItem} from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';
import {stopEvent} from '../../menu/utils';
import {CommonSessionCard} from './CommonSessionCard';



export function byDateDesc(a: any, b: any) {
    return -((a.ts || 0) - (b.ts || 0));
}


export function TemporarySessionCard() {
    const parent = useRef(null);
    const [tempSessions, setTempSessions] = React.useState<IProvenanceGraphDataDescription[]>(null);
    const {graph, manager} = React.useContext(GraphContext);

    const listSessions = React.useMemo(() => async () => {
        const tempSessions = (await manager.list())?.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setTempSessions(tempSessions);
    }, []);

    const {status, error} = useAsync(listSessions);


    return (
        <>
            <CommonSessionCard cardName="Temporary Sessions" faIcon="fa-history" cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tempCardInfo')}>
                {(exportSession, cloneSession, saveSession, deleteSession) => {
                    return <> {
                        tempSessions?.map((session) => {
                            return <SessionListItem key={session.id} status={status} desc={session} error={error}>
                                <Button variant="outline-secondary" className="mr-2 pt-1 pb-1" onClick={(event) => saveSession(event, session)}>Save</Button>
                                <ListItemDropdown ref={parent}>
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
