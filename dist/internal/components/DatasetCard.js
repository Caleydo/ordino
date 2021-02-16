import React from 'react';
import { Card, Nav, Tab } from 'react-bootstrap';
import { DatasetSection } from './DatasetSection';
export function DatasetCard({ headerText, headerIcon, database, dbViewBase, idType, tabs }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left mt-4 mb-3" },
            React.createElement("i", { className: 'mr-2 ordino-icon-2 ' + headerIcon }),
            " ",
            headerText),
        React.createElement(Card, { className: "shadow-sm" },
            React.createElement(Card.Body, { className: "p-3" },
                React.createElement(Tab.Container, { defaultActiveKey: tabs[0].id },
                    React.createElement(Nav, { className: "session-tab", variant: "pills" }, tabs.map((tab) => {
                        return (React.createElement(Nav.Item, { key: tab.id },
                            React.createElement(Nav.Link, { eventKey: tab.id },
                                React.createElement("i", { className: 'mr-2 ' + tab.tabIcon }),
                                tab.tabText)));
                    })),
                    React.createElement(Tab.Content, null, tabs.map((tab) => {
                        return (React.createElement(Tab.Pane, { key: tab.id, eventKey: tab.id, className: "mt-4" },
                            React.createElement(DatasetSection, { species: tab.id, idType: idType, database: database, dbViewBase: dbViewBase })));
                    })))))));
}
//# sourceMappingURL=DatasetCard.js.map