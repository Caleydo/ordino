import {I18nextManager} from 'phovea_core';
import React from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import {ProvenanceGraphMenuUtils} from 'tdp_core';
import {IStartMenuSessionSectionDesc} from '../../..';
import {GraphContext} from '../../OrdinoApp';
import {ListItemDropdown} from '../common';
import {EAction, CommonSessionCard} from './CommonSessionCard';
import {SessionListItem} from './SessionListItem';


export default function CurrentSessionCard({name, faIcon}: IStartMenuSessionSectionDesc) {
    const {graph} = React.useContext(GraphContext);
    const desc = graph.desc;
    return (
        <CommonSessionCard cardName={name} faIcon={faIcon} cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo')}>
            {(sessionAction) => {
                return <SessionListItem desc={desc} selectSession={(event) => sessionAction(EAction.SELECT, event, desc)}>
                    <Button variant="outline-secondary" disabled={ProvenanceGraphMenuUtils.isPersistent(desc)} className="mr-2 pt-1 pb-1" onClick={(event) => sessionAction(EAction.SAVE, event, desc)}>Save</Button>
                    <ListItemDropdown>
                        <Dropdown.Item onClick={(event) => sessionAction(EAction.CLONE, event, desc)}>Clone</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => sessionAction(EAction.EXPORT, event, desc)}>Export</Dropdown.Item>
                        <Dropdown.Item className="dropdown-delete" onClick={(event) => sessionAction(EAction.DELETE, event, desc)}>Delete</Dropdown.Item>
                    </ListItemDropdown>
                </SessionListItem>;
            }}
        </CommonSessionCard>
    );

}
