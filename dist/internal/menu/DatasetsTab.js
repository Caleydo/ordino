import React from 'react';
import { Container, Col, Nav, Row, Button } from 'react-bootstrap';
import { Link, Element } from 'react-scroll';
import { UniqueIdManager } from 'phovea_core';
import { DatasetCard, UploadDatasetCard } from '../components';
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
                    React.createElement(UploadDatasetCard, { id: "upload", title: "Upload", faIcon: "fas fa-file-upload" }))))));
}
//# sourceMappingURL=DatasetsTab.js.map