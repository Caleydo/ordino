import React, { useMemo } from 'react';
import { PluginRegistry } from 'visyn_core/plugin';
import { useAsync } from 'visyn_core/hooks';
import { I18nextManager } from 'visyn_core/i18n';
import { UniqueIdManager } from 'tdp_core';
import { BrowserRouter } from 'react-router-dom';
import { OrdinoScrollspy, OrdinoScrollspyItem } from '../../components';
import { EP_ORDINO_STARTMENU_DATASET_SECTION } from '../../../base/extensions';
import { OrdinoFooter } from '../../../components';
export default function DatasetsTab(_props) {
    const suffix = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);
    const loadCards = useMemo(() => () => {
        const sectionEntries = PluginRegistry.getInstance()
            .listPlugins(EP_ORDINO_STARTMENU_DATASET_SECTION)
            .map((d) => d);
        return Promise.all(sectionEntries.map((section) => section.load()));
    }, []);
    const { status, value: items } = useAsync(loadCards, []);
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, status === 'success' ? (React.createElement(OrdinoScrollspy, { items: items.map((card) => ({ id: `${card.desc.id}_${suffix}`, name: card.desc.name })) }, (handleOnChange) => (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "container pb-10 pt-5" },
            React.createElement("div", { className: "row justify-content-center" },
                React.createElement("div", { className: "col-11 position-relative", "data-testid": "datasets-tab" },
                    React.createElement("p", { className: "lead text-gray-600 mb-0" },
                        " ",
                        I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.datasetTabInfo')),
                    items.map((item, index) => {
                        return (
                        // `id` attribute must match the one in the scrollspy
                        React.createElement(OrdinoScrollspyItem, { className: "pt-3 pb-5", id: `${item.desc.id}_${suffix}`, key: item.desc.id, index: index, handleOnChange: handleOnChange },
                            React.createElement(item.factory, { ...item.desc })));
                    })))),
        React.createElement(BrowserRouter, { basename: "/#" },
            React.createElement(OrdinoFooter, { openInNewWindow: true, testId: "datasets-tab" })))))) : null));
}
//# sourceMappingURL=DatasetsTab.js.map