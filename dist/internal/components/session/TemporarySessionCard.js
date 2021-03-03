import { I18nextManager } from 'phovea_core';
import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../menu/StartMenuReact';
import { byDateDesc } from '../../menu/tabs/SessionsTab';
import { ListItemDropdown } from '../common';
import { CommonSessionCard } from './CommonSessionCard';
import { SessionListItem } from './SessionListItem';
export default function TemporarySessionCard({ name, faIcon, cssClass }) {
    const { app } = React.useContext(GraphContext);
    const [sessions, setSessions] = React.useState(null);
    const listSessions = React.useMemo(() => async () => {
        var _a;
        const all = (_a = (await app.graphManager.list())) === null || _a === void 0 ? void 0 : _a.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
        setSessions(all);
    }, []);
    const { status } = useAsync(listSessions);
    return (React.createElement(React.Fragment, null,
        React.createElement(CommonSessionCard, { cardName: name, faIcon: faIcon, cardInfo: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tempCardInfo') }, (sessionAction) => {
            return React.createElement(React.Fragment, null,
                status === 'pending' &&
                    React.createElement("p", null,
                        React.createElement("i", { className: "fas fa-circle-notch fa-spin" }),
                        " Loading sets..."),
                status === 'success' &&
                    sessions.length === 0 &&
                    React.createElement("p", null, "No sets available"),
                status === 'success' && sessions.length > 0 && (sessions === null || sessions === void 0 ? void 0 : sessions.map((session) => {
                    return React.createElement(SessionListItem, { key: session.id, desc: session, selectSession: (event) => sessionAction("select" /* SELECT */, event, session) },
                        React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1", onClick: (event) => sessionAction("save" /* SAVE */, event, session) }, "Save"),
                        React.createElement(ListItemDropdown, null,
                            React.createElement(Dropdown.Item, { onClick: (event) => sessionAction("clone" /* CLONE */, event, session) }, "Clone"),
                            React.createElement(Dropdown.Item, { onClick: (event) => sessionAction("epxport" /* EXPORT */, event, session) }, "Export"),
                            React.createElement(Dropdown.Item, { className: "dropdown-delete", onClick: (event) => sessionAction("delete" /* DELETE */, event, session, setSessions) }, "Delete")));
                })),
                status === 'error' && React.createElement("p", null, "Error when loading sets"));
        })));
}
//# sourceMappingURL=TemporarySessionCard.js.map