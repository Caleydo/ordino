import React from 'react';
import { Card, Nav, Tab } from 'react-bootstrap';
import { DatasetSection } from './DatasetSection';
export function DatasetCard({ title, faIcon }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left mt-4 mb-3" },
            React.createElement("i", { className: 'mr-2 ordino-icon-2 ' + faIcon }),
            " ",
            title),
        React.createElement(Card, { className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                React.createElement(Tab.Container, { defaultActiveKey: "human" },
                    React.createElement(Nav, { className: "session-tab", variant: "pills" },
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "human" },
                                React.createElement("i", { className: "mr-2 fas fa-male" }),
                                "Human")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { disabled: true, eventKey: "mouse" },
                                " ",
                                React.createElement("i", { className: "mr-2 fa fa-fw mouse-icon" }),
                                "Mouse"))),
                    React.createElement(Tab.Content, null,
                        React.createElement(Tab.Pane, { eventKey: "human", className: "mt-4" },
                            React.createElement(DatasetSection, null))))))));
}
//# sourceMappingURL=DatasetCard.js.map