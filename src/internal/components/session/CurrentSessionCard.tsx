import {I18nextManager} from 'phovea_core';
import React from 'react';
import {Button, Dropdown} from 'react-bootstrap';
import {ProvenanceGraphMenuUtils} from 'tdp_core';
import {IStartMenuSectionDesc} from '../../..';
import {GraphContext} from '../../menu/StartMenuReact';
import {ListItemDropdown} from '../common';
import {Action, CommonSessionCard} from './CommonSessionCard';
import {SessionListItem} from './SessionListItem';


export default function CurrentSessionCard({name, faIcon, cssClass}: IStartMenuSectionDesc) {
    const {app} = React.useContext(GraphContext);
    const desc = app.graph.desc;
    return (
        <CommonSessionCard cardName={name} faIcon={faIcon} cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo')}>
            {(sessionAction) => {
                return <SessionListItem desc={desc} selectSession={(event) => sessionAction(Action.SELECT, event, desc)}>
                    <Button variant="outline-secondary" disabled={ProvenanceGraphMenuUtils.isPersistent(desc)} className="mr-2 pt-1 pb-1" onClick={(event) => sessionAction(Action.SAVE, event, desc)}>Save</Button>
                    <ListItemDropdown>
                        <Dropdown.Item onClick={(event) => sessionAction(Action.CLONE, event, desc)}>Clone</Dropdown.Item>
                        <Dropdown.Item onClick={(event) => sessionAction(Action.EXPORT, event, desc)}>Export</Dropdown.Item>
                        <Dropdown.Item className="dropdown-delete" onClick={(event) => sessionAction(Action.DELETE, event, desc)}>Delete</Dropdown.Item>
                    </ListItemDropdown>
                </SessionListItem>;
            }}
        </CommonSessionCard>
    );

}
