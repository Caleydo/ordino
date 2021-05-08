import {I18nextManager} from 'phovea_core';
import React from 'react';
import {ProvenanceGraphMenuUtils} from 'tdp_core';
import {IStartMenuSessionSectionDesc} from '../../..';
import {GraphContext, HighlightSessionCardContext} from '../../OrdinoApp';
import {ListItemDropdown} from '../../../components';
import {EAction, CommonSessionCard} from './CommonSessionCard';
import {SessionListItem} from './SessionListItem';


export default function CurrentSessionCard({name, faIcon}: IStartMenuSessionSectionDesc) {
    const {graph} = React.useContext(GraphContext);
    const {highlight, setHighlight} = React.useContext(HighlightSessionCardContext);
    const desc = graph.desc;

    const onHighlightAnimationEnd = () => {
      setHighlight(false);
    };

    return (
        <CommonSessionCard cardName={name} highlight={highlight} onHighlightAnimationEnd={onHighlightAnimationEnd} faIcon={faIcon} cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo')}>
            {(sessionAction) => {
                return <SessionListItem desc={desc} selectSession={(event) => sessionAction(EAction.SELECT, event, desc)}>
                    <button type="button" className="mr-2 pt-1 pb-1 btn btn-outline-secondary" disabled={ProvenanceGraphMenuUtils.isPersistent(desc)} onClick={(event) => sessionAction(EAction.SAVE, event, desc)}>Save</button>
                    <ListItemDropdown>
                        <button className="dropdown-item" onClick={(event) => sessionAction(EAction.CLONE, event, desc)}>Clone</button>
                        <button className="dropdown-item" onClick={(event) => sessionAction(EAction.EXPORT, event, desc)}>Export</button>
                        <button className="dropdown-delete dropdown-item" onClick={(event) => sessionAction(EAction.DELETE, event, desc)}>Delete</button>
                    </ListItemDropdown>
                </SessionListItem>;
            }}
        </CommonSessionCard>
    );

}
