import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
export function StartMenu(parentElement) {
    return ReactDOM.render(React.createElement(React.Fragment, null,
        React.createElement(Tab.Container, { id: "left-tabs-example", defaultActiveKey: "first" },
            React.createElement(Row, null,
                React.createElement(Col, { sm: 3 },
                    React.createElement(Nav, { variant: "pills", className: "flex-column" },
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "first" }, "Tab 1")),
                        React.createElement(Nav.Item, null,
                            React.createElement(Nav.Link, { eventKey: "second" }, "Tab 2")))),
                React.createElement(Col, { sm: 9 },
                    React.createElement(Tab.Content, null,
                        React.createElement(Tab.Pane, { eventKey: "first" },
                            React.createElement("div", null, "First")),
                        React.createElement(Tab.Pane, { eventKey: "second" },
                            React.createElement("div", null, "Second"))))))), parentElement);
}
//# sourceMappingURL=StartMenuReact.js.map