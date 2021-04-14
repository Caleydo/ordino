import * as React from 'react';
import Card from 'react-bootstrap/Card';
import { Col, Button } from 'react-bootstrap';
export function TourCard({ image, title, text, onClickHandler, href }) {
    return (React.createElement(Col, null,
        React.createElement(Card, { className: "ordino-tour-card shadow-sm" },
            image ?
                React.createElement(Card.Img, { style: { height: '200px' }, variant: "top", className: "p-2", src: image })
                : null,
            React.createElement(Card.Body, { className: "p-2" },
                React.createElement(Card.Title, null, title),
                React.createElement(Card.Text, null, text),
                React.createElement(Button, { className: "btn btn-light", href: href, onClick: onClickHandler },
                    React.createElement("i", { className: "mr-1 fas fa-angle-right" }),
                    " Start Tour")))));
}
//# sourceMappingURL=TourCard.js.map