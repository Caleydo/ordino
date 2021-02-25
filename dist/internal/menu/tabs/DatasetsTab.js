import React from 'react';
import { Container, Col, Nav, Row } from 'react-bootstrap';
import { Link, Element } from 'react-scroll';
import { UniqueIdManager } from 'phovea_core';
import { DatasetCard, UploadDatasetCard } from '../../components';
export function DatasetsTab() {
    const suffix = UniqueIdManager.getInstance().uniqueId();
    const cards = [
        {
            id: 'genes',
            idType: 'Ensembl',
            headerText: 'Genes',
            headerIcon: 'fas fa-database',
            database: 'publicdb',
            dbViewBase: 'gene',
            tabs: [
                { id: 'human', tabText: 'Human', tabIcon: 'fas fa-male' },
                { id: 'mouse', tabText: 'Mouse', tabIcon: 'fas fa-fw mouse-icon' }
            ]
        },
        {
            id: 'celllines',
            idType: 'Cellline',
            headerText: 'Cell Lines',
            headerIcon: 'fas fa-database',
            database: 'publicdb',
            dbViewBase: 'cellline',
            tabs: [
                { id: 'human', tabText: 'Human', tabIcon: 'fas fa-male' },
                { id: 'mouse', tabText: 'Mouse', tabIcon: 'fas fa-fw mouse-icon' }
            ]
        },
        {
            id: 'tissues',
            idType: 'Tissue',
            headerText: 'Tissues',
            headerIcon: 'fas fa-database',
            database: 'publicdb',
            dbViewBase: 'tissue',
            tabs: [
                { id: 'human', tabText: 'Human', tabIcon: 'fas fa-male' },
            ]
        },
    ];
    return (React.createElement(React.Fragment, null,
        React.createElement(Nav, { className: "scrollspy-nav flex-column ml-4" },
            cards.map((card) => {
                return (React.createElement(Link, { key: card.id, className: "nav-link", role: "button", to: `${card.id}_${suffix}`, spy: true, smooth: true, offset: -250, duration: 500 }, card.headerText));
            }),
            React.createElement(Link, { className: "nav-link", role: "button", to: `upload_${suffix}`, spy: true, smooth: true, offset: -250, duration: 500 }, "Upload")),
        React.createElement(Container, { className: "mb-4 datasets-tab" },
            React.createElement(Row, null,
                React.createElement(Col, null,
                    React.createElement(Element, null,
                        React.createElement("p", { className: "ordino-info-text" }, "Start a new analysis session by loading a dataset")),
                    cards.map((card) => {
                        return (React.createElement(Element, { key: card.id, className: "pt-6", name: `${card.id}_${suffix}` },
                            React.createElement(DatasetCard, Object.assign({ key: card.id }, card))));
                    }),
                    React.createElement(Element, { className: "py-6", name: `upload_${suffix}` },
                        React.createElement(UploadDatasetCard, { id: "upload", headerText: "Upload", headerIcon: "fas fa-file-upload" })))))));
}
//# sourceMappingURL=DatasetsTab.js.map