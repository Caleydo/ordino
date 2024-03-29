import React, { useMemo } from 'react';
import { UniqueIdManager } from 'tdp_core';
import { useAsync } from 'visyn_core/hooks';
import { PluginRegistry } from 'visyn_core/plugin';
import { BrowserRouter } from 'react-router-dom';
import { EP_ORDINO_STARTMENU_SESSION_SECTION } from '../../../base/extensions';
import { OrdinoScrollspy, OrdinoScrollspyItem } from '../../components';
import { OrdinoFooter } from '../../../components';
function byPriority(a, b) {
    return (a.priority || 10) - (b.priority || 10);
}
export default function SessionsTab(_props) {
    const suffix = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);
    const loadSections = useMemo(() => () => {
        const sectionEntries = PluginRegistry.getInstance()
            .listPlugins(EP_ORDINO_STARTMENU_SESSION_SECTION)
            .map((d) => d)
            .sort(byPriority);
        return Promise.all(sectionEntries.map((section) => section.load()));
    }, []);
    const { status, value: items } = useAsync(loadSections, []);
    return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, status === 'success' ? (React.createElement(OrdinoScrollspy, { items: items.map((item) => ({ id: `${item.desc.id}_${suffix}`, name: item.desc.name })) }, (handleOnChange) => (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "container pb-10 pt-5" },
            React.createElement("div", { className: "row justify-content-center" },
                React.createElement("div", { className: "col-11 position-relative", "data-testid": "sessions-tab" }, items?.map((item, index) => {
                    return (
                    // `id` attribute must match the one in the scrollspy
                    React.createElement(OrdinoScrollspyItem, { className: "pt-3 pb-5", id: `${item.desc.id}_${suffix}`, key: item.desc.id, index: index, "data-testid": `${item.desc.id}_${suffix}`, handleOnChange: handleOnChange },
                        React.createElement(item.factory, { ...item.desc })));
                })))),
        React.createElement(BrowserRouter, { basename: "/#" },
            React.createElement(OrdinoFooter, { openInNewWindow: true, testId: "sessions-tab" })))))) : null));
}
//# sourceMappingURL=SessionsTab.js.map