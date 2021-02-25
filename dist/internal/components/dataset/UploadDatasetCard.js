import React from 'react';
import { Card, Nav, Tab } from 'react-bootstrap';
import { DatasetDropzone } from './DatasetDropzone';
import { UploadDatasetListItem } from './UploadDatasetListItem';
export function UploadDatasetCard({ headerText, headerIcon }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left mt-4 mb-3" },
            React.createElement("i", { className: 'mr-2 ordino-icon-2 ' + headerIcon }),
            " ",
            headerText),
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
                            React.createElement(UploadDatasetListItem, { accessType: "public", name: "anylysis_dataset", uploadedDate: "Mon, 10 Aug 2020" }),
                            React.createElement(UploadDatasetListItem, { accessType: "private", name: "crispr_dataset", uploadedDate: "Mon, 10 Sep 2020", description: "This is an optional description for the dataset file" }),
                            React.createElement(UploadDatasetListItem, { accessType: "public", uploadedDate: "Mon, 10 Nov 2020", name: "crispr_dataset" })),
                        React.createElement(Tab.Pane, { eventKey: "publicDatasets", className: "mt-4" },
                            React.createElement(UploadDatasetListItem, { accessType: "public", name: "crispr_dataset", uploadedDate: "Mon, 10 Aug 2020" }))))))));
}
//# sourceMappingURL=UploadDatasetCard.js.map