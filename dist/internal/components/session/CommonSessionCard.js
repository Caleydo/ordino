import { I18nextManager } from 'phovea_core';
import { FormDialog } from 'phovea_ui';
import React, { useRef } from 'react';
import { Card } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils, ErrorAlertHandler, NotificationHandler } from 'tdp_core';
import { GraphContext } from '../../OrdinoAppComponent';
export function CommonSessionCard({ cardName, faIcon, cardInfo, children }) {
    const parent = useRef(null);
    const { graph, manager } = React.useContext(GraphContext);
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
        //create blob and save it
        const blob = new Blob([str], { type: 'application/json;charset=utf-8' });
        const a = new FileReader();
        a.onload = (e) => {
            const url = (e.target).result;
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
        const deleteIt = await FormDialog.areyousure(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.deleteIt', { name: desc.name }));
        if (deleteIt) {
            await Promise.resolve(manager.delete(desc)).then((r) => {
                if (callback) {
                    NotificationHandler.successfullyDeleted(I18nextManager.getInstance().i18n.t('tdp:core.SessionList.session'), desc.name);
                    callback((sessions) => sessions === null || sessions === void 0 ? void 0 : sessions.filter((t) => t.id !== desc.id));
                }
                else {
                    manager.startFromScratch();
                }
            }).catch(ErrorAlertHandler.getInstance().errorAlert);
        }
        return false;
    };
    return React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left d-flex align-items-center mb-3" },
            React.createElement("i", { className: `mr-2 ordino-icon-2 fas ${faIcon}` }),
            cardName),
        React.createElement(Card, { ref: parent, className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                cardInfo || React.createElement(Card.Text, null, cardInfo),
                children(exportSession, cloneSession, saveSession, deleteSession))));
}
//# sourceMappingURL=CommonSessionCard.js.map