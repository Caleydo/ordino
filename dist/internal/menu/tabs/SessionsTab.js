import React from 'react';
import { Container, Col, Nav, Row, Button } from 'react-bootstrap';
import { Link, Element } from 'react-scroll';
import { UniqueIdManager } from 'phovea_core';
import { UploadSessionCard } from '../../components';
import { CurrentSessionCard } from '../../components/session/CurrentSessionCard';
import { SavedSessionCard } from '../../components/session/SavedSessionCard';
import { TemporarySessionCard } from '../../components/session/TemporarySessionCard';
export function SessionsTab() {
    const cards = [
        {
            id: 'current',
            headerText: 'Current Session',
            getElement: () => React.createElement(CurrentSessionCard, null)
        },
        {
            id: 'saved',
            headerText: 'Saved Session',
            getElement: () => React.createElement(SavedSessionCard, null)
        },
        {
            id: 'temporary',
            headerText: 'Temporary Session',
            getElement: () => React.createElement(TemporarySessionCard, null)
        },
        {
            id: 'import',
            headerText: 'Import Session',
            getElement: () => React.createElement(UploadSessionCard, null)
        }
    ];
    const suffix = UniqueIdManager.getInstance().uniqueId();
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, null,
            React.createElement(Col, { className: "d-flex justify-content-end" },
                React.createElement(Button, { className: "start-menu-close", variant: "link" },
                    React.createElement("i", { className: "fas fa-times" })))),
        React.createElement(Nav, { className: "scrollspy-nav flex-column ml-4" }, cards.map((card) => React.createElement(Link, { className: "nav-link", key: card.id, role: "button", to: `${card.id}-${suffix}`, spy: true, smooth: true, offset: -300, duration: 500 }, card.headerText))),
        React.createElement(Container, { className: "mb-4 analysis-tab" },
            React.createElement(Row, null,
                React.createElement(Col, null, cards.map((card, i) => {
                    return React.createElement(Element, { className: `${i === 0 || 'pt-6'}`, key: card.id, name: `${card.id}-${suffix}` }, card.getElement());
                }))))));
}
//# sourceMappingURL=SessionsTab.js.map