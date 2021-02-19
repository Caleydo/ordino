import React from 'react';
import { Card } from 'react-bootstrap';
import { CurrentSessionListItem } from '..';
export function CurrentSessionCard() {
    return (React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left d-flex align-items-center mb-3" },
            React.createElement("i", { className: "mr-2 ordino-icon-2 fas fa-history" }),
            "Current Session"),
        React.createElement(Card, { className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                React.createElement(Card.Text, null, "Save the current session to open it later again or share it with other users."),
                React.createElement(CurrentSessionListItem, { name: "Temporary Session 159", uploadedDate: "a minute ago" })))));
}
//# sourceMappingURL=CurrentSessionCard.js.map