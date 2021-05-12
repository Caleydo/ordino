import React, { useMemo } from 'react';
import { PluginRegistry, UniqueIdManager } from 'phovea_core';
import { OrdinoScrollspy, OrdinoScrollspyItem } from '../../components';
import { EP_ORDINO_STARTMENU_DATASET_SECTION } from '../../..';
import { useAsync } from '../../../hooks';
import { BrowserRouter } from 'react-router-dom';
import { OrdinoFooter } from '../../../components';
export function DatasetsTab(_props) {
    const suffix = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);
    const loadCards = useMemo(() => () => {
        const sectionEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_STARTMENU_DATASET_SECTION).map((d) => d);
        return Promise.all(sectionEntries.map((section) => section.load()));
    }, []);
    const { status, value: items } = useAsync(loadCards);
    return (React.createElement(React.Fragment, null, status === 'success' ?
        React.createElement(OrdinoScrollspy, { items: items.map((card) => ({ id: `${card.desc.id}_${suffix}`, name: card.desc.name })) }, (handleOnChange) => React.createElement(React.Fragment, null,
            React.createElement("div", { className: "container pb-10 pt-5" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col" },
                        React.createElement("p", { className: "lead text-ordino-gray-4 mb-0" }, "Start a new analysis session by loading a dataset"),
                        items.map((item, index) => {
                            return (
                            // `id` attribute must match the one in the scrollspy
                            React.createElement(OrdinoScrollspyItem, { className: "pt-3 pb-5", id: `${item.desc.id}_${suffix}`, key: item.desc.id, index: index, handleOnChange: handleOnChange },
                                React.createElement(item.factory, Object.assign({}, item.desc))));
                        })))),
            React.createElement(BrowserRouter, { basename: "/#" },
                React.createElement(OrdinoFooter, { openInNewWindow: true })))) : null));
}
//# sourceMappingURL=DatasetsTab.js.map