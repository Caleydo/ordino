import { I18nextManager } from 'visyn_core/i18n';
import { UserSession } from 'visyn_core/security';
import { GlobalEventHandler } from 'visyn_core/base';
import { PHOVEA_UI_FormDialog, ProvenanceGraphMenuUtils, ErrorAlertHandler, NotificationHandler } from 'tdp_core';
import React, { useRef } from 'react';
import { GraphContext } from '../../constants';
/**
 * Wrapper component that exposes actions to be used in children components.
 */
export function CommonSessionCard({ cardName, faIcon, cardInfo, children, highlight, onHighlightAnimationStart, onHighlightAnimationEnd, }) {
    const parent = useRef(null);
    const { manager, graph } = React.useContext(GraphContext);
    const selectSession = (event, desc) => {
        event.preventDefault();
        event.stopPropagation();
        if (UserSession.getInstance().canWrite(desc)) {
            manager.loadGraph(desc);
        }
        else {
            manager.cloneLocal(desc);
        }
        return false;
    };
    const saveSession = (event, desc) => {
        event.preventDefault();
        event.stopPropagation();
        ProvenanceGraphMenuUtils.persistProvenanceGraphMetaData(desc).then((extras) => {
            if (extras !== null) {
                manager.importExistingGraph(desc, extras, true).catch(ErrorAlertHandler.getInstance().errorAlert);
            }
        });
        return false;
    };
    const editSession = (event, desc, callback) => {
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
                    callback((sessions) => {
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
    const cloneSession = (event, desc) => {
        event.preventDefault();
        event.stopPropagation();
        manager.cloneLocal(desc);
        return false;
    };
    // TODO refactor this to export the correct graph. Now it exports the current one.
    const exportSession = (event, desc) => {
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
            const url = e.target.result;
            const helper = parent.current.ownerDocument.createElement('a');
            helper.setAttribute('href', url);
            helper.setAttribute('target', '_blank');
            helper.setAttribute('download', `${graph.desc.name}.json`);
            parent.current.appendChild(helper);
            helper.click();
            helper.remove();
            NotificationHandler.pushNotification('success', I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successMessage', { name: graph.desc.name }), NotificationHandler.DEFAULT_SUCCESS_AUTO_HIDE);
        };
        a.readAsDataURL(blob);
        return false;
    };
    const deleteSession = async (event, desc, callback) => {
        event.preventDefault();
        event.stopPropagation();
        const deleteIt = await PHOVEA_UI_FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', { name: desc.name }));
        if (deleteIt) {
            await Promise.resolve(manager.delete(desc))
                .then((r) => {
                if (callback && desc.id !== graph.desc.id) {
                    NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), desc.name);
                    callback((sessions) => sessions?.filter((t) => t.id !== desc.id));
                }
                else {
                    manager.startFromScratch();
                }
            })
                .catch(ErrorAlertHandler.getInstance().errorAlert);
        }
        return false;
    };
    const sessionAction = (type, event, desc, updateSessions) => {
        switch (type) {
            case "select" /* EAction.SELECT */:
                return selectSession(event, desc);
            case "save" /* EAction.SAVE */:
                return saveSession(event, desc);
            case "edit" /* EAction.EDIT */:
                return editSession(event, desc, updateSessions);
            case "clone" /* EAction.CLONE */:
                return cloneSession(event, desc);
            case "export" /* EAction.EXPORT */:
                return exportSession(event, desc);
            case "delete" /* EAction.DELETE */:
                return deleteSession(event, desc, updateSessions);
            default:
                return undefined;
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-start d-flex align-items-center mb-3" },
            React.createElement("i", { className: `me-2 ordino-icon-2 fas ${faIcon}` }),
            cardName),
        React.createElement("div", { ref: parent, className: `card card-shadow ${highlight ? 'highlight-card' : ''}`, onAnimationStart: onHighlightAnimationStart, "data-testid": `${cardName.replace(/\s+/g, '-').toLowerCase()}-sessionscard`, onAnimationEnd: onHighlightAnimationEnd },
            React.createElement("div", { className: "card-body p-3" },
                cardInfo && React.createElement("p", { className: "card-text mb-4" }, cardInfo),
                children(sessionAction)))));
}
//# sourceMappingURL=CommonSessionCard.js.map