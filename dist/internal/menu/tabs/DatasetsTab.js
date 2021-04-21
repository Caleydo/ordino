import React, { useMemo } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { PluginRegistry, UniqueIdManager } from 'phovea_core';
import { OrdinoScrollspy } from '../../components';
import { EP_ORDINO_STARTMENU_DATASET_SECTION } from '../../..';
import { useAsync } from '../../../hooks';
import { BrowserRouter } from 'react-router-dom';
import { OrdinoFooter } from '../../../components';
export function DatasetsTab() {
    const suffix = UniqueIdManager.getInstance().uniqueId();
    const loadCards = useMemo(() => () => {
        const sectionEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_STARTMENU_DATASET_SECTION).map((d) => d);
        return Promise.all(sectionEntries.map((section) => section.load()));
    }, []);
    const { status, value: cards } = useAsync(loadCards);
    return (React.createElement(React.Fragment, null, status === 'success' ?
        React.createElement(OrdinoScrollspy, { items: cards.map((card) => ({ id: `${card.desc.id}_${suffix}`, name: card.desc.name })) },
            React.createElement(Container, { className: "pb-10 pt-5" },
                React.createElement(Row, null,
                    React.createElement(Col, null,
                        React.createElement("p", { className: "lead text-ordino-gray-4 mb-0" }, "Start a new analysis session by loading a dataset"),
                        cards.map((card) => {
                            return (
                            // `id` attribute must match the one in the scrollspy
                            React.createElement("div", { key: card.desc.id, className: "pt-3 pb-5", id: `${card.desc.id}_${suffix}` },
                                React.createElement(card.factory, Object.assign({ key: card.desc.id }, card.desc))));
                        })))),
            React.createElement(BrowserRouter, { basename: "/#" },
                React.createElement(OrdinoFooter, { openInNewWindow: true }))) : null));
}
//# sourceMappingURL=DatasetsTab.js.map