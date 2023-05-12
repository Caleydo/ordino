import { I18nextManager } from 'visyn_core/i18n';
import { useAsync } from 'visyn_core/hooks';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import React from 'react';
import { GraphContext } from '../../constants';
import { ListItemDropdown } from '../../../components';
import { CommonSessionCard } from './CommonSessionCard';
import { SessionListItem } from './SessionListItem';
import { byDateDesc } from './utils';
export default function TemporarySessionCard({ name, faIcon }) {
    const { manager } = React.useContext(GraphContext);
    const [sessions, setSessions] = React.useState(null);
    const listSessions = React.useMemo(() => async () => {
        const all = (await manager.list())?.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setSessions(all);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const { status } = useAsync(listSessions, []);
    return (React.createElement(CommonSessionCard, { cardName: name, faIcon: faIcon, cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tempCardInfo') }, (sessionAction) => {
        return (React.createElement("div", { className: "position-relative" },
            React.createElement("div", { className: "ordino-session-list p-1" },
                status === 'pending' && (React.createElement("p", null,
                    React.createElement("i", { className: "fas fa-circle-notch fa-spin" }),
                    " ",
                    I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingSets'))),
                status === 'success' && sessions.length === 0 && React.createElement("p", null, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.noSetsAvailable')),
                status === 'success' &&
                    sessions.length > 0 &&
                    sessions?.map((session) => {
                        return (React.createElement(SessionListItem, { key: session.id, desc: session, selectSession: (event) => sessionAction("select" /* EAction.SELECT */, event, session) },
                            React.createElement("button", { type: "button", className: "me-2 pt-1 pb-1 btn btn-outline-secondary", "data-testid": "save-button", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.saveSession'), onClick: (event) => sessionAction("save" /* EAction.SAVE */, event, session) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.save')),
                            React.createElement(ListItemDropdown, null,
                                React.createElement("button", { type: "button", className: "dropdown-item", "data-testid": "clone-button", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.cloneToTemporary'), onClick: (event) => sessionAction("clone" /* EAction.CLONE */, event, session) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.clone')),
                                React.createElement("button", { type: "button", className: "dropdown-delete dropdown-item", "data-testid": "delete-button", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.deleteSession'), onClick: (event) => sessionAction("delete" /* EAction.DELETE */, event, session, setSessions) }, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.delete')))));
                    }),
                status === 'error' && React.createElement("p", null, I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.loadingError')))));
    }));
}
//# sourceMappingURL=TemporarySessionCard.js.map