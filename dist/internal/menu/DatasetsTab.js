import React from 'react';
import { Container, Card, Col, Nav, Row, Tab, Button } from 'react-bootstrap';
import { Link, Element } from 'react-scroll';
import { UniqueIdManager } from 'phovea_core';
import { DatasetDropzone, DatasetCard, UploadedItem } from '../components';
export function DatasetsTab() {
    const suffix = UniqueIdManager.getInstance().uniqueId();
    return (React.createElement(Container, { fluid: true, className: "mb-4 datasets-tab" },
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
                    React.createElement(DatasetCard, { id: "genes", title: "Genes", faIcon: "fas fa-database" })),
                React.createElement(Element, { className: "pt-6", name: `celllines_${suffix}` },
                    React.createElement(DatasetCard, { id: "celllines", title: "Cell Lines", faIcon: "fas fa-database" })),
                React.createElement(Element, { className: "pt-6", name: `tissues_${suffix}` },
                    React.createElement(DatasetCard, { id: "tissues", title: "Tissues", faIcon: "fas fa-database" })),
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