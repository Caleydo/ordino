import {I18nextManager, IProvenanceGraphDataDescription} from 'phovea_core';
import React, {useRef} from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import {DropdownItemProps} from 'react-bootstrap/esm/DropdownItem';
import {ErrorAlertHandler, FormDialog, NotificationHandler, ProvenanceGraphMenuUtils, TDPApplicationUtils} from 'tdp_core';
import {byDateDesc, ListItemDropdown, SessionListItem, } from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';
import {stopEvent} from '../../menu/utils';
import {CommonSessionCard} from './CommonSessionCard';

export function CurrentSessionCard() {
    const parent = useRef(null);
    const [currentSession, setCurrentSession] = React.useState(null);
    const {graph, manager} = React.useContext(GraphContext);

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
                    <ListItemDropdown ref={parent} >
                        <Dropdown.Item onClick={(event) => cloneSession(event, currentSession)}>Clone</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => exportSession(event, currentSession)}>Export</Dropdown.Item>
                        <Dropdown.Item className="dropdown-delete" onClick={(event) => deleteSession(event, currentSession)}>Delete</Dropdown.Item>
                    </ListItemDropdown>
                </SessionListItem>;
            }}
        </CommonSessionCard>
    );

}

