import React, { useMemo } from 'react';
import { Container, Col, Row, ListGroup } from 'react-bootstrap';
import { PluginRegistry, UniqueIdManager } from 'phovea_core';
import { UploadDatasetCard } from '../../components';
import { EP_ORDINO_STARTMENU_DATASET_SECTION } from '../../..';
import { useAsync } from '../../../hooks';
export function DatasetsTab() {
    const suffix = UniqueIdManager.getInstance().uniqueId();
    const loadCards = useMemo(() => () => {
        const sectionEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_STARTMENU_DATASET_SECTION).map((d) => d);
        return Promise.all(sectionEntries.map((section) => section.load()));
    }, []);
    const { status, value: cards } = useAsync(loadCards);
    /**
     * Get the href attribute and find the corresponding element with the id.
     * If found scroll the element into the viewport.
     * @param evt Click event
     */
    const scrollIntoView = (evt) => {
        var _a;
        evt.preventDefault(); // prevent jumping to element with id and scroll smoothly instead
        (_a = document.querySelector(evt.currentTarget.getAttribute('href'))) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        return false;
    };
    return (React.createElement(React.Fragment, null, status === 'success' ?
        React.createElement(React.Fragment, null,
            React.createElement(ListGroup, { variant: "flush", id: "datasets-tab-scrollspy-nav", className: "scrollspy-nav flex-column ml-4" },
                cards.map((card) => {
                    return (
                    // Important: We cannot use the react-bootstrap `ListGroup.Item` here, because it sets the `active` class automatically at `onClick`.
                    // This behavior cannot be supressed and interfers with the Bootstrap scrollspy + `scrollIntoView` which causes a flickering of the navigation items.
                    // The only solution is to use a plain `a` element and add the necessary Bootstrap classes here.
                    // <ListGroup.Item key={card.desc.id} action href={`#${card.desc.id}_${suffix}`} onClick={scrollIntoView} className="pl-0 mt-0 border-0 bg-transparent">{card.desc.name}</ListGroup.Item>
                    React.createElement("a", { key: card.desc.id, href: `#${card.desc.id}_${suffix}`, onClick: scrollIntoView, className: "pl-0 mt-0 border-0 bg-transparent list-group-item list-group-item-action" }, card.desc.name));
                }),
                React.createElement("a", { href: `#upload_${suffix}`, onClick: scrollIntoView, className: "pl-0 mt-0 border-0 bg-transparent list-group-item list-group-item-action" }, "Upload")),
            React.createElement(Container, { className: "mb-4" },
                React.createElement(Row, null,
                    React.createElement(Col, null,
                        React.createElement("p", { className: "lead text-ordino-gray-4 mb-0" }, "Start a new analysis session by loading a dataset"),
                        cards.map((card) => {
                            return (React.createElement("div", { key: card.desc.id, className: "pt-3 pb-5", id: `${card.desc.id}_${suffix}` },
                                React.createElement(card.factory, Object.assign({ key: card.desc.id }, card.desc))));
                        }),
                        React.createElement("div", { className: "pt-3", id: `upload_${suffix}` },
                            React.createElement(UploadDatasetCard, { id: "upload", headerText: "Upload", headerIcon: "fas fa-file-upload" })))))) : null));
}
//# sourceMappingURL=DatasetsTab.js.map