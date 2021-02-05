import * as React from 'react';
import Card from 'react-bootstrap/Card';
import { Col, Button } from 'react-bootstrap';
export function TourCard({ image, title, text, onClickHandler }) {
    return (React.createElement(Col, null,
        React.createElement(Card, { className: "ordino-tour-card shadow-sm" },
            React.createElement(Card.Img, { variant: "top", className: "p-2", src: image }),
            React.createElement(Card.Body, { className: "p-2" },
                React.createElement(Card.Title, null, title),
                React.createElement(Card.Text, null, text),
                React.createElement(Button, { variant: "secondary", onClick: onClickHandler }, "Start")))));
}
//# sourceMappingURL=TourCard.js.map