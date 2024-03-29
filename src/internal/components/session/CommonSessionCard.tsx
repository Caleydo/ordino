import { I18nextManager } from 'visyn_core/i18n';
import { UserSession } from 'visyn_core/security';
import { GlobalEventHandler } from 'visyn_core/base';
import { IProvenanceGraphDataDescription, PHOVEA_UI_FormDialog, ProvenanceGraphMenuUtils, ErrorAlertHandler, NotificationHandler } from 'tdp_core';
import React, { useRef, AnimationEventHandler } from 'react';
import { GraphContext } from '../../constants';

interface ICommonSessionCardProps {
  cardName: string;
  faIcon: string;
  cardInfo?: string;
  children?: (sessionAction: SessionActionChooser) => React.ReactNode;

  /**
   * If set to `true` the card is rendered with a halo animation
   */
  highlight?: boolean;

  /**
   * Callback when the highlight animation starts
   * @see https://reactjs.org/docs/events.html#animation-events
   */
  onHighlightAnimationStart?: AnimationEventHandler<any>;

  /**
   * Callback when the highlight animation ends
   * @see https://reactjs.org/docs/events.html#animation-events
   */
  onHighlightAnimationEnd?: AnimationEventHandler<any>;
}

/**
 * Types of actions exposed by the CommonSessionCard component
 */
export const enum EAction {
  SELECT = 'select',
  SAVE = 'save',
  EDIT = 'edit',
  CLONE = 'clone',
  EXPORT = 'export',
  DELETE = 'delete',
}

export type SessionActionChooser = (
  type: EAction,
  event: React.MouseEvent<HTMLElement>,
  desc: IProvenanceGraphDataDescription,
  updateSessions?: any,
) => boolean | Promise<boolean>;
export type SessionAction = (event: React.MouseEvent<HTMLElement>, desc: IProvenanceGraphDataDescription, updateSessions?: any) => boolean | Promise<boolean>;

/**
 * Wrapper component that exposes actions to be used in children components.
 */
export function CommonSessionCard({
  cardName,
  faIcon,
  cardInfo,
  children,
  highlight,
  onHighlightAnimationStart,
  onHighlightAnimationEnd,
}: ICommonSessionCardProps) {
  const parent = useRef(null);
  const { manager, graph } = React.useContext(GraphContext);

  const selectSession = (event: React.MouseEvent, desc: IProvenanceGraphDataDescription) => {
    event.preventDefault();
    event.stopPropagation();
    if (UserSession.getInstance().canWrite(desc)) {
      manager.loadGraph(desc);
    } else {
      manager.cloneLocal(desc);
    }
    return false;
  };

  const saveSession = (event: React.MouseEvent, desc: IProvenanceGraphDataDescription) => {
    event.preventDefault();
    event.stopPropagation();

    ProvenanceGraphMenuUtils.persistProvenanceGraphMetaData(desc).then((extras: any) => {
      if (extras !== null) {
        manager.importExistingGraph(desc, extras, true).catch(ErrorAlertHandler.getInstance().errorAlert);
      }
    });
    return false;
  };

  const editSession = (event: React.MouseEvent, desc: IProvenanceGraphDataDescription, callback?: any) => {
    event.preventDefault();
    event.stopPropagation();
    // TODO: why is the check for the graph necessary here?
    // if (graph) {
    //   return false;
    // }
    ProvenanceGraphMenuUtils.editProvenanceGraphMetaData(desc, { permission: ProvenanceGraphMenuUtils.isPersistent(desc) }).then((extras) => {
      if (extras !== null) {
        Promise.resolve(manager.editGraphMetaData(desc, extras))
          .then((d) => {
            callback((sessions: IProvenanceGraphDataDescription[]) => {
              const copy = [...sessions];
              const i = copy.findIndex((s) => s.id === d.id);
              copy[i] = d;
              return copy;
            });
            GlobalEventHandler.getInstance().fire(ProvenanceGraphMenuUtils.GLOBAL_EVENT_MANIPULATED);
          })
          .catch(ErrorAlertHandler.getInstance().errorAlert);
      }
    });
    return false;
  };

  const cloneSession = (event: React.MouseEvent, desc: IProvenanceGraphDataDescription) => {
    event.preventDefault();
    event.stopPropagation();

    manager.cloneLocal(desc);
    return false;
  };

  // TODO refactor this to export the correct graph. Now it exports the current one.
  const exportSession = (event: React.MouseEvent, desc: IProvenanceGraphDataDescription) => {
    event.preventDefault();
    event.stopPropagation();

    if (!graph) {
      return false;
    }

    // console.log(graph);
    const r = graph.persist();
    // console.log(r);
    const str = JSON.stringify(r, null, '\t');
    // create blob and save it
    const blob = new Blob([str], { type: 'application/json;charset=utf-8' });
    const a = new FileReader();
    a.onload = (e) => {
      const url = e.target.result as string;
      const helper = parent.current.ownerDocument.createElement('a');
      helper.setAttribute('href', url);
      helper.setAttribute('target', '_blank');
      helper.setAttribute('download', `${graph.desc.name}.json`);
      parent.current.appendChild(helper);
      helper.click();
      helper.remove();
      NotificationHandler.pushNotification(
        'success',
        I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successMessage', { name: graph.desc.name }),
        NotificationHandler.DEFAULT_SUCCESS_AUTO_HIDE,
      );
    };
    a.readAsDataURL(blob);
    return false;
  };

  const deleteSession = async (event: React.MouseEvent, desc: IProvenanceGraphDataDescription, callback?: any) => {
    event.preventDefault();
    event.stopPropagation();
    const deleteIt = await PHOVEA_UI_FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', { name: desc.name }));
    if (deleteIt) {
      await Promise.resolve(manager.delete(desc))
        .then((r) => {
          if (callback && desc.id !== graph.desc.id) {
            NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), desc.name);
            callback((sessions: IProvenanceGraphDataDescription[]) => sessions?.filter((t) => t.id !== desc.id));
          } else {
            manager.startFromScratch();
          }
        })
        .catch(ErrorAlertHandler.getInstance().errorAlert);
    }
    return false;
  };

  const sessionAction = (type: EAction, event: React.MouseEvent, desc: IProvenanceGraphDataDescription, updateSessions?: any) => {
    switch (type) {
      case EAction.SELECT:
        return selectSession(event, desc);
      case EAction.SAVE:
        return saveSession(event, desc);
      case EAction.EDIT:
        return editSession(event, desc, updateSessions);
      case EAction.CLONE:
        return cloneSession(event, desc);
      case EAction.EXPORT:
        return exportSession(event, desc);
      case EAction.DELETE:
        return deleteSession(event, desc, updateSessions);
      default:
        return undefined;
    }
  };

  return (
    <>
      <h4 className="text-start d-flex align-items-center mb-3">
        <i className={`me-2 ordino-icon-2 fas ${faIcon}`} />
        {cardName}
      </h4>
      <div
        ref={parent}
        className={`card card-shadow ${highlight ? 'highlight-card' : ''}`}
        onAnimationStart={onHighlightAnimationStart}
        data-testid={`${cardName.replace(/\s+/g, '-').toLowerCase()}-sessionscard`}
        onAnimationEnd={onHighlightAnimationEnd}
      >
        <div className="card-body p-3">
          {cardInfo && <p className="card-text mb-4">{cardInfo}</p>}
          {children(sessionAction)}
        </div>
      </div>
    </>
  );
}
