import React from 'react';
import { Card } from 'react-bootstrap';
export function CommonSessionCard({ cardName, faIcon, cardInfo, children }) {
    return React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left d-flex align-items-center mb-3" },
            React.createElement("i", { className: `mr-2 ordino-icon-2 fas ${faIcon}` }),
            cardName),
        React.createElement(Card, { className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                cardInfo || React.createElement(Card.Text, null, cardInfo),
                children)));
}
//# sourceMappingURL=CommonSessionCard.js.map