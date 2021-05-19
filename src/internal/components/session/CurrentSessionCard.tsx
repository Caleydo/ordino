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
                const disabled = ProvenanceGraphMenuUtils.isPersistent(desc);
                return <SessionListItem desc={desc} selectSession={(event) => sessionAction(EAction.SELECT, event, desc)}>
                    <button type="button" className="mr-2 pt-1 pb-1 btn btn-outline-secondary" title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.saveSession')} disabled={disabled} onClick={(event) => sessionAction(EAction.SAVE, event, desc)}>
                        {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.save')}
                    </button>
                    <ListItemDropdown>
                        <button className="dropdown-item" title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneSession')} onClick={(event) => sessionAction(EAction.CLONE, event, desc)}>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.clone')}</button>
                        <button className="dropdown-item" title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.exportSession')} onClick={(event) => sessionAction(EAction.EXPORT, event, desc)}>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.export')}</button>
                        <button className="dropdown-delete dropdown-item" title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.deleteSession')} onClick={(event) => sessionAction(EAction.DELETE, event, desc)}>{I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete')}</button>
                    </ListItemDropdown>
                </SessionListItem>;
            }}
        </CommonSessionCard>
    );

}
