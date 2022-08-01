import React from 'react';
import {
  GlobalEventHandler,
  I18nextManager,
  PropertyHandler,
  ProvenanceGraph,
  ErrorAlertHandler,
  NotificationHandler,
  ProvenanceGraphMenuUtils,
} from 'tdp_core';

import { GraphContext, HighlightSessionCardContext } from '../../constants';
import { ListItemDropdown } from '../../../components';
import { EAction, CommonSessionCard } from './CommonSessionCard';
import { SessionListItem } from './SessionListItem';

import type { IStartMenuSessionSectionDesc } from '../../../base/extensions';

export default function CurrentSessionCard({ name, faIcon }: IStartMenuSessionSectionDesc) {
  const { manager, graph } = React.useContext(GraphContext);
  const { highlight, setHighlight } = React.useContext(HighlightSessionCardContext);
  const [desc, setDesc] = React.useState(graph.desc);

  const onHighlightAnimationEnd = () => {
    setHighlight(false);
  };

  const saveCurrentSession = (event: React.MouseEvent, g: ProvenanceGraph) => {
    event.preventDefault();
    event.stopPropagation();
    if (ProvenanceGraphMenuUtils.isPersistent(g.desc)) {
      return false;
    }
    ProvenanceGraphMenuUtils.persistProvenanceGraphMetaData(g.desc).then((extras: any) => {
      if (extras !== null) {
        Promise.resolve(manager.migrateGraph(g, extras))
          .catch(ErrorAlertHandler.getInstance().errorAlert)
          .then(() => {
            setDesc(g.desc);

            const url = manager.getCLUEGraphURL();

            NotificationHandler.pushNotification(
              'success',
              `${I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successNotification', { name: g.desc.name })}
            <br>${I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.urlToShare')} <br>
            <a href="${url}" title="${I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.currentLink')}">${url}</a>`,
              -1,
            );
            GlobalEventHandler.getInstance().fire(ProvenanceGraphMenuUtils.GLOBAL_EVENT_MANIPULATED);
          });
      }
    });
    return false;
  };

  return (
    <CommonSessionCard
      cardName={name}
      highlight={highlight}
      onHighlightAnimationEnd={onHighlightAnimationEnd}
      faIcon={faIcon}
      cardInfo={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo')}
    >
      {(sessionAction) => {
        return (
          <SessionListItem desc={desc} selectSession={(event) => sessionAction(EAction.SELECT, event, desc)}>
            <button
              type="button"
              className="me-2 pt-1 pb-1 btn btn-outline-secondary"
              title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.saveSession')}
              disabled={ProvenanceGraphMenuUtils.isPersistent(desc)}
              onClick={(event) => saveCurrentSession(event, graph)}
            >
              {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.save')}
            </button>
            <ListItemDropdown>
              <button
                type="button"
                className="dropdown-item"
                title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneSession')}
                onClick={(event) => sessionAction(EAction.CLONE, event, desc)}
              >
                {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.clone')}
              </button>
              <button
                type="button"
                className="dropdown-item"
                title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.exportSession')}
                onClick={(event) => sessionAction(EAction.EXPORT, event, desc)}
              >
                {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.export')}
              </button>
              <button
                type="button"
                className="dropdown-delete dropdown-item"
                title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.deleteSession')}
                onClick={(event) => sessionAction(EAction.DELETE, event, desc)}
              >
                {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete')}
              </button>
            </ListItemDropdown>
          </SessionListItem>
        );
      }}
    </CommonSessionCard>
  );
}
