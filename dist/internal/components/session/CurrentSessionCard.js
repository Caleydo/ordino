import React from 'react';
import { GlobalEventHandler, I18nextManager, ErrorAlertHandler, NotificationHandler, ProvenanceGraphMenuUtils } from 'tdp_core';
import { GraphContext, HighlightSessionCardContext } from '../../constants';
import { ListItemDropdown } from '../../../components';
import { CommonSessionCard } from './CommonSessionCard';
import { SessionListItem } from './SessionListItem';
export default function CurrentSessionCard({ name, faIcon }) {
    const { manager, graph } = React.useContext(GraphContext);
    const { highlight, setHighlight } = React.useContext(HighlightSessionCardContext);
    const [desc, setDesc] = React.useState(graph.desc);
    const onHighlightAnimationEnd = () => {
        setHighlight(false);
    };
    const saveCurrentSession = (event, g) => {
        event.preventDefault();
        event.stopPropagation();
        if (ProvenanceGraphMenuUtils.isPersistent(g.desc)) {
            return false;
        }
        ProvenanceGraphMenuUtils.persistProvenanceGraphMetaData(g.desc).then((extras) => {
            if (extras !== null) {
                Promise.resolve(manager.migrateGraph(g, extras))
                    .catch(ErrorAlertHandler.getInstance().errorAlert)
                    .then(() => {
                    setDesc(g.desc);
                    const url = manager.getCLUEGraphURL();
                    NotificationHandler.pushNotification('success', `${I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successNotification', { name: g.desc.name })}
            <br>${I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.urlToShare')} <br>
            <a href="${url}" title="${I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.currentLink')}">${url}</a>`, -1);
                    GlobalEventHandler.getInstance().fire(ProvenanceGraphMenuUtils.GLOBAL_EVENT_MANIPULATED);
                });
            }
        });
        return false;
    };
    return (React.createElement(CommonSessionCard, { cardName: name, highlight: highlight, onHighlightAnimationEnd: onHighlightAnimationEnd, faIcon: faIcon, cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo') }, (sessionAction) => {
        return (React.createElement(SessionListItem, { desc: desc, selectSession: (event) => sessionAction("select" /* SELECT */, event, desc) },
            React.createElement("button", { type: "button", className: "me-2 pt-1 pb-1 btn btn-outline-secondary", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.saveSession'), disabled: ProvenanceGraphMenuUtils.isPersistent(desc), onClick: (event) => saveCurrentSession(event, graph) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.save')),
            React.createElement(ListItemDropdown, null,
                React.createElement("button", { type: "button", className: "dropdown-item", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneSession'), onClick: (event) => sessionAction("clone" /* CLONE */, event, desc) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.clone')),
                React.createElement("button", { type: "button", className: "dropdown-item", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.exportSession'), onClick: (event) => sessionAction("export" /* EXPORT */, event, desc) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.export')),
                React.createElement("button", { type: "button", className: "dropdown-delete dropdown-item", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.deleteSession'), onClick: (event) => sessionAction("delete" /* DELETE */, event, desc) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete')))));
    }));
}
//# sourceMappingURL=CurrentSessionCard.js.map