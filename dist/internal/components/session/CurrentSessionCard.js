import React from 'react';
import { Card } from 'react-bootstrap';
import { TemporarySessionListItem } from '..';
import { useAsync } from '../../../hooks';
import { GraphContext } from '../../menu/StartMenuReact';
export function CurrentSessionCard() {
    const { manager } = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => () => manager.list(), []);
    const { status, value, error } = useAsync(listSessions);
    // I am not sure this is the best way to get the current session
    const current = value === null || value === void 0 ? void 0 : value[(value === null || value === void 0 ? void 0 : value.length) - 1];
    return (React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left d-flex align-items-center mb-3" },
            React.createElement("i", { className: "mr-2 ordino-icon-2 fas fa-history" }),
            "Current Session"),
        React.createElement(Card, { className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                React.createElement(Card.Text, null, "Save the current session to open it later again or share it with other users."),
                React.createElement(TemporarySessionListItem, { status: status, value: current, error: error })))));
}
//# sourceMappingURL=CurrentSessionCard.js.map