import {I18nextManager} from 'phovea_core';
import React, {useRef} from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import {ProvenanceGraphMenuUtils} from 'tdp_core';
import {byDateDesc, ListItemDropdown, SessionListItem, } from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';
import {CommonSessionCard} from './CommonSessionCard';

export function CurrentSessionCard() {
    const [currentSession, setCurrentSession] = React.useState(null);
    const {manager} = React.useContext(GraphContext);


    //TODO the list session function is similar for all the three cards, we should maybe try to extract it
    const listSessions = React.useMemo(() => async () => {
        const tempSessions = (await manager.list())?.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setCurrentSession(tempSessions?.[0]);
    }, []);

    const {status, error} = useAsync(listSessions);

    return (
        <CommonSessionCard cardName="Current Session" faIcon="fa-history" cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo')}>
            {(exportSession, cloneSession, saveSession, deleteSession) => {
                return <SessionListItem status={status} desc={currentSession} error={error}>
                    <Button variant="outline-secondary" className="mr-2 pt-1 pb-1" onClick={(event) => saveSession(event, currentSession)}>Save</Button>
                    <ListItemDropdown>
                        <Dropdown.Item onClick={(event) => cloneSession(event, currentSession)}>Clone</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => exportSession(event, currentSession)}>Export</Dropdown.Item>
                        <Dropdown.Item className="dropdown-delete" onClick={(event) => deleteSession(event, currentSession)}>Delete</Dropdown.Item>
                    </ListItemDropdown>
                </SessionListItem>;
            }}
        </CommonSessionCard>
    );

}

