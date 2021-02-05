import React from "react";
import { Card } from 'react-bootstrap';
import { SessionItem } from '../components/SessionItem';
export const TempSessions = () => {
    return (React.createElement(Card, { style: {}, className: "shadow-sm" },
        React.createElement(Card.Body, { className: "p-3" },
            React.createElement(Card.Text, null, "A temporary session will only be stored in your local browser cache.It is not possible to share a link to states of this session with others. Only the 10 most recent sessions will be stored."),
            React.createElement(SessionItem, { title: "Temporary session 20" }),
            React.createElement(SessionItem, { title: "Temporary session 19" }),
            React.createElement(SessionItem, { title: "Temporary session 18" }),
            React.createElement(SessionItem, { title: "Temporary session 17" }))));
};
//# sourceMappingURL=TempSession.js.map