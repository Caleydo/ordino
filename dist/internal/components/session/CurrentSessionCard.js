import { GlobalEventHandler, I18nextManager, PropertyHandler } from 'phovea_core';
import React from 'react';
import { ErrorAlertHandler, NotificationHandler, ProvenanceGraphMenuUtils } from 'tdp_core';
import { GraphContext, HighlightSessionCardContext } from '../../OrdinoApp';
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
    const saveCurrentSession = (event, graph) => {
        event.preventDefault();
        event.stopPropagation();
        if (ProvenanceGraphMenuUtils.isPersistent(graph.desc)) {
            return false;
        }
        ProvenanceGraphMenuUtils.persistProvenanceGraphMetaData(graph.desc).then((extras) => {
            console.log('extra', graph, extras);
            if (extras !== null) {
                Promise.resolve(manager.migrateGraph(graph, extras)).catch(ErrorAlertHandler.getInstance().errorAlert).then(() => {
                    setDesc(graph.desc);
                    const p = new PropertyHandler(location.hash);
                    const hash = new Map();
                    p.forEach((key, value) => {
                        hash.set(key, `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
                    });
                    hash.set('clue_graph', `clue_graph=${encodeURIComponent(graph.desc.id)}`);
                    hash.set('clue_state', `clue_state=${graph.act.id}`);
                    const url = `${location.href.replace(location.hash, '')}#${Array.from(hash.values()).join('&')}`;
                    NotificationHandler.pushNotification('success', `${I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.successNotification', { name: graph.desc.name })}
              <br>${I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.urlToShare')} <br>
              <a href="${url}" title="${I18nextManager.getInstance().i18n.t('tdp:core.EditProvenanceMenu.currentLink')}">${url}</a>`, -1);
                    GlobalEventHandler.getInstance().fire(ProvenanceGraphMenuUtils.GLOBAL_EVENT_MANIPULATED);
                });
            }
        });
        return false;
    };
    return (React.createElement(CommonSessionCard, { cardName: name, highlight: highlight, onHighlightAnimationEnd: onHighlightAnimationEnd, faIcon: faIcon, cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.currentCardInfo') }, (sessionAction) => {
        return React.createElement(SessionListItem, { desc: desc, selectSession: (event) => sessionAction("select" /* SELECT */, event, desc) },
            React.createElement("button", { type: "button", className: "me-2 pt-1 pb-1 btn btn-outline-secondary", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.saveSession'), disabled: ProvenanceGraphMenuUtils.isPersistent(desc), onClick: (event) => saveCurrentSession(event, graph) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.save')),
            React.createElement(ListItemDropdown, null,
                React.createElement("button", { className: "dropdown-item", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneSession'), onClick: (event) => sessionAction("clone" /* CLONE */, event, desc) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.clone')),
                React.createElement("button", { className: "dropdown-item", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.exportSession'), onClick: (event) => sessionAction("export" /* EXPORT */, event, desc) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.export')),
                React.createElement("button", { className: "dropdown-delete dropdown-item", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.deleteSession'), onClick: (event) => sessionAction("delete" /* DELETE */, event, desc) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete'))));
    }));
}
//# sourceMappingURL=CurrentSessionCard.js.map