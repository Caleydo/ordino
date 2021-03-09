import { GlobalEventHandler, I18nextManager, UserSession } from 'phovea_core';
import { FormDialog } from 'phovea_ui';
import React, { useRef } from 'react';
import { Card } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils, ErrorAlertHandler, NotificationHandler } from 'tdp_core';
import { OrdinoAppContext } from '../../menu/StartMenuReact';
/**
 * Wrapper component that exposes actions to be used in children components.
 */
export function CommonSessionCard({ cardName, faIcon, cardInfo, children }) {
    const parent = useRef(null);
    const { app } = React.useContext(OrdinoAppContext);
    const selectSession = (event, desc) => {
        event.preventDefault();
        event.stopPropagation();
        if (UserSession.getInstance().canWrite(desc)) {
            app.graphManager.loadGraph(desc);
        }
        else {
            app.graphManager.cloneLocal(desc);
        }
        return false;
    };
    const saveSession = (event, desc) => {
        event.preventDefault();
        event.stopPropagation();
        ProvenanceGraphMenuUtils.persistProvenanceGraphMetaData(desc).then((extras) => {
            if (extras !== null) {
                app.graphManager.importExistingGraph(desc, extras, true).catch(ErrorAlertHandler.getInstance().errorAlert);
            }
        });
        return false;
    };
    // TODO why is the check for the graph necessary here?
    const editSession = (event, desc, callback) => {
        event.preventDefault();
        event.stopPropagation();
        // if (graph) {
        //   return false;
        // }
        ProvenanceGraphMenuUtils.editProvenanceGraphMetaData(desc, { permission: ProvenanceGraphMenuUtils.isPersistent(desc) }).then((extras) => {
            if (extras !== null) {
                Promise.resolve(app.graphManager.editGraphMetaData(desc, extras))
                    .then((desc) => {
                    callback((sessions) => {
                        const copy = [...sessions];
                        const i = copy.findIndex((s) => s.id === desc.id);
                        copy[i] = desc;
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
        app.graphManager.cloneLocal(desc);
        return false;
    };
    // TODO refactor this to export the correct graph. Now it exports the current one.
    const exportSession = (event, desc) => {
        event.preventDefault();
        event.stopPropagation();
        if (!app.graph) {
            return false;
        }
        // console.log(graph);
        const r = app.graph.persist();
        // console.log(r);
        const str = JSON.stringify(r, null, '\t');
        //create blob and save it
        const blob = new Blob([str], { type: 'application/json;charset=utf-8' });
        const a = new FileReader();
        a.onload = (e) => {
            const url = (e.target).result;
            const helper = parent.current.ownerDocument.createElement('a');
            helper.setAttribute('href', url);
            helper.setAttribute('target', '_blank');
            helper.setAttribute('download', `${app.graph.desc.name}.json`);
            parent.current.appendChild(helper);
            helper.click();
            helper.remove();
            NotificationHandler.pushNotification('success', I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successMessage', { name: app.graph.desc.name }), NotificationHandler.DEFAULT_SUCCESS_AUTO_HIDE);
        };
        a.readAsDataURL(blob);
        return false;
    };
    const deleteSession = async (event, desc, callback) => {
        event.preventDefault();
        event.stopPropagation();
        const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', { name: desc.name }));
        if (deleteIt) {
            await Promise.resolve(app.graphManager.delete(desc)).then((r) => {
                if (callback) {
                    NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), desc.name);
                    callback((sessions) => sessions === null || sessions === void 0 ? void 0 : sessions.filter((t) => t.id !== desc.id));
                }
                else {
                    app.graphManager.startFromScratch();
                }
            }).catch(ErrorAlertHandler.getInstance().errorAlert);
        }
        return false;
    };
    const sessionAction = (type, event, desc, updateSessions) => {
        switch (type) {
            case "select" /* SELECT */:
                return selectSession(event, desc);
            case "save" /* SAVE */:
                return saveSession(event, desc);
            case "edit" /* EDIT */:
                return editSession(event, desc, updateSessions);
            case "clone" /* CLONE */:
                return cloneSession(event, desc);
            case "epxport" /* EXPORT */:
                return exportSession(event, desc);
            case "delete" /* DELETE */:
                return deleteSession(event, desc, updateSessions);
        }
    };
    return React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left d-flex align-items-center mb-3" },
            React.createElement("i", { className: `mr-2 ordino-icon-2 fas ${faIcon}` }),
            cardName),
        React.createElement(Card, { ref: parent, className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                cardInfo || React.createElement(Card.Text, null, cardInfo),
                children(sessionAction))));
}
//# sourceMappingURL=CommonSessionCard.js.map