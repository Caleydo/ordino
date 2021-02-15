import React from 'react';
import { Container, Card, Col, Nav, Row, Tab, Button } from 'react-bootstrap';
import { Link, Element } from 'react-scroll';
import { UniqueIdManager } from 'phovea_core';
import { DatasetSection } from '../components/DatasetSection';
import { UploadedItem } from '../components/UploadedItem';
import { DatasetDropzone } from '../components/DatasetDropzone';
const genSets = [
    'All',
    'Cancer Gene Census',
    'Essential Genes',
];
const publicSets = [
    'Dd',
    'TP53 Predictor Score',
    'List'
];
const mySets = [
    'My Collection',
    'Research Focus 1',
    'Research Focus 2'
];
export function DatasetsTab() {
    const suffix = UniqueIdManager.getInstance().uniqueId();
    return (React.createElement(Container, { fluid: true, className: "my-4 datasets-tab" },
        React.createElement(Row, null,
            React.createElement(Col, { className: "d-flex justify-content-end" },
                React.createElement(Button, { className: "start-menu-close", variant: "link" },
                    React.createElement("i", { className: "fas fa-times" })))),
        React.createElement(Row, null,
            React.createElement(Col, { md: 3 },
                React.createElement(Nav, { className: "scrollspy-nav flex-column" },
                    React.createElement(Link, { className: "nav-link", role: "button", to: `genes_${suffix}`, spy: true, smooth: true, offset: -250, duration: 500 }, "Genes"),
                    React.createElement(Link, { className: "nav-link", role: "button", to: `cellline_${suffix}`, spy: true, smooth: true, offset: -250, duration: 500 }, "Cell Lines"),
                    React.createElement(Link, { className: "nav-link", role: "button", to: `tissue_${suffix}`, spy: true, smooth: true, offset: -250, duration: 500 }, "Tissues"),
                    React.createElement(Link, { className: "nav-link", role: "button", to: `upload_${suffix}`, spy: true, smooth: true, offset: -250, duration: 500 }, "Upload"))),
            React.createElement(Col, { md: 6 },
                React.createElement(Element, { name: `genes_${suffix}` },
                    React.createElement("p", { className: "ordino-info-text" }, "Start a new analysis session by loading a dataset"),
                    React.createElement("h4", { className: "text-left mt-4 mb-3" },
                        React.createElement("i", { className: "mr-2 ordino-icon-2 fas fa-database" }),
                        " Genes"),
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
                                        React.createElement(DatasetSection, null))))))),
                React.createElement(Element, { className: "pt-6", name: `cellline_${suffix}` },
                    React.createElement("h4", { className: "text-left mt-4 mb-3" },
                        React.createElement("i", { className: "mr-2 fas ordino-icon-2 fa-database" }),
                        " Cell Lines"),
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
                                React.createElement(Row, { className: "pt-4" },
                                    React.createElement(Col, null,
                                        React.createElement(Tab.Content, null,
                                            React.createElement(Tab.Pane, { eventKey: "human" },
                                                React.createElement(DatasetSection, null))))))))),
                React.createElement(Element, { className: "pt-6", name: `tissue_${suffix}` },
                    React.createElement("h4", { className: "text-left mt-4 mb-3" },
                        React.createElement("i", { className: "mr-2 ordino-icon-2 fas fa-database" }),
                        " Tissues"),
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
                                React.createElement(Row, { className: "pt-4" },
                                    React.createElement(Col, null,
                                        React.createElement(Tab.Content, null,
                                            React.createElement(Tab.Pane, { eventKey: "human" },
                                                React.createElement(DatasetSection, null))))))))),
                React.createElement(Element, { className: "py-6", name: `upload_${suffix}` },
                    React.createElement("h4", { className: "text-left mt-4 mb-3" },
                        React.createElement("i", { className: "mr-2 ordino-icon-2 fas fa-file-upload" }),
                        " Upload"),
                    React.createElement(Card, { className: "shadow-sm" },
                        React.createElement(Card.Body, { className: "p-3" },
                            React.createElement(DatasetDropzone, null),
                            React.createElement(Tab.Container, { defaultActiveKey: "myDatasets" },
                                React.createElement(Nav, { className: "session-tab mt-4", variant: "pills" },
                                    React.createElement(Nav.Item, null,
                                        React.createElement(Nav.Link, { eventKey: "myDatasets" },
                                            React.createElement("i", { className: "mr-2 fas fa-user" }),
                                            "My Datasets")),
                                    React.createElement(Nav.Item, null,
                                        React.createElement(Nav.Link, { eventKey: "publicDatasets" },
                                            " ",
                                            React.createElement("i", { className: "mr-2 fas fa-users" }),
                                            "Public Datasets"))),
                                React.createElement(Tab.Content, null,
                                    React.createElement(Tab.Pane, { eventKey: "myDatasets", className: "mt-4" },
                                        React.createElement(UploadedItem, { accessType: "public", name: "anylysis_dataset", uploadedDate: "Mon, 10 Aug 2020" }),
                                        React.createElement(UploadedItem, { accessType: "private", name: "crispr_dataset", uploadedDate: "Mon, 10 Sep 2020", description: "This is an optional description for the dataset file" }),
                                        React.createElement(UploadedItem, { accessType: "public", uploadedDate: "Mon, 10 Nov 2020", name: "crispr_dataset" })),
                                    React.createElement(Tab.Pane, { eventKey: "publicDatasets", className: "mt-4" },
                                        React.createElement(UploadedItem, { accessType: "public", name: "crispr_dataset", uploadedDate: "Mon, 10 Aug 2020" })))))))))));
}
//# sourceMappingURL=DatasetsTab.js.map