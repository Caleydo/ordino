import React, { useMemo } from 'react';
import { Container, Col, Nav, Row, Button } from 'react-bootstrap';
import { Link, Element } from 'react-scroll';
import { PluginRegistry, UniqueIdManager } from 'phovea_core';
import { UploadDatasetCard } from '../../components';
import { EXTENSION_POINT_STARTMENU_DATASET } from '../../..';
import { useAsync } from '../../../hooks';
export function DatasetsTab() {
    const suffix = UniqueIdManager.getInstance().uniqueId();
    const loadCards = useMemo(() => () => {
        const sectionEntries = PluginRegistry.getInstance().listPlugins(EXTENSION_POINT_STARTMENU_DATASET).map((d) => d);
        return Promise.all(sectionEntries.map((section) => section.load()));
    }, []);
    const { status, value: cards } = useAsync(loadCards);
    return (React.createElement(React.Fragment, null,
        React.createElement(Row, null,
            React.createElement(Col, { className: "d-flex justify-content-end" },
                React.createElement(Button, { className: "start-menu-close", variant: "link" },
                    React.createElement("i", { className: "fas fa-times" })))),
        React.createElement(Nav, { className: "scrollspy-nav flex-column ml-4" },
            status === 'success' ?
                cards.map((card) => {
                    return (React.createElement(Link, { key: card.desc.id, className: "nav-link", role: "button", to: `${card.desc.id}_${suffix}`, spy: true, smooth: true, offset: -250, duration: 500 }, card.desc.name));
                }) : null,
            React.createElement(Link, { className: "nav-link", role: "button", to: `upload_${suffix}`, spy: true, smooth: true, offset: -250, duration: 500 }, "Upload")),
        React.createElement(Container, { className: "mb-4 datasets-tab" },
            React.createElement(Row, null,
                React.createElement(Col, null,
                    React.createElement(Element, null,
                        React.createElement("p", { className: "ordino-info-text" }, "Start a new analysis session by loading a dataset")),
                    status === 'success' ?
                        cards.map((card) => {
                            return (React.createElement(Element, { key: card.desc.id, className: "pt-6", name: `${card.desc.id}_${suffix}` },
                                React.createElement(card.factory, Object.assign({ key: card.desc.id }, card.desc))));
                        }) : null,
                    React.createElement(Element, { className: "py-6", name: `upload_${suffix}` },
                        React.createElement(UploadDatasetCard, { id: "upload", headerText: "Upload", headerIcon: "fas fa-file-upload" })))))));
}
//# sourceMappingURL=DatasetsTab.js.map