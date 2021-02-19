import React from 'react';
import { Card } from 'react-bootstrap';
import { ProvenanceGraphMenuUtils } from 'tdp_core';
import { TemporarySessionListItem } from '..';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../menu/StartMenuReact';
export function byDateDesc(a, b) {
    return -((a.ts || 0) - (b.ts || 0));
}
export function TemporarySessionCard() {
    // Todo merge CurrentSessionCard with TemorarySessionCard
    const { manager } = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => () => manager.list(), []);
    const { status, value: sessions, error } = useAsync(listSessions);
    const tempSessions = sessions === null || sessions === void 0 ? void 0 : sessions.filter((d) => !ProvenanceGraphMenuUtils.isPersistent(d)).sort(byDateDesc);
    return (React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left mt-4 mb-3" },
            React.createElement("i", { className: "mr-2 ordino-icon-2 fas fa-history" }),
            "Temporary Sessions"),
        React.createElement(Card, { className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                React.createElement(Card.Text, null, "A temporary session will only be stored in your local browser cache.It is not possible to share a link to states of this session with others. Only the 10 most recent sessions will be stored."), tempSessions === null || tempSessions === void 0 ? void 0 :
                tempSessions.map((tempSession) => React.createElement(TemporarySessionListItem, { status: status, value: tempSession, error: error }))))));
}
//# sourceMappingURL=TemporarySessionCard.js.map