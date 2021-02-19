import React from 'react';
import { Card } from 'react-bootstrap';
import { CurrentSessionListItem } from '..';
export function TemporarySessionCard() {
    return (React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left mt-4 mb-3" },
            React.createElement("i", { className: "mr-2 ordino-icon-2 fas fa-history" }),
            "Temporary Sessions"),
        React.createElement(Card, { className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                React.createElement(Card.Text, null, "A temporary session will only be stored in your local browser cache.It is not possible to share a link to states of this session with others. Only the 10 most recent sessions will be stored."),
                React.createElement(CurrentSessionListItem, { name: "Temporary session 20", uploadedDate: "a minute ago" }),
                React.createElement(CurrentSessionListItem, { name: "Temporary session 19", uploadedDate: "5 minutes ago" }),
                React.createElement(CurrentSessionListItem, { name: "Temporary session 18", uploadedDate: "10 minutes ago" }),
                React.createElement(CurrentSessionListItem, { name: "Temporary session 17", uploadedDate: "15 minutes ago" })))));
}
//# sourceMappingURL=TemporarySessionCard.js.map