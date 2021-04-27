import React, { useMemo } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { InView } from 'react-intersection-observer';
import { PluginRegistry, UniqueIdManager } from 'phovea_core';
import { useAsync } from '../../../hooks';
import { EP_ORDINO_STARTMENU_SESSION_SECTION } from '../../..';
import { OrdinoScrollspy } from '../../components';
import { BrowserRouter } from 'react-router-dom';
import { OrdinoFooter } from '../../../components';
function byPriority(a, b) {
    return (a.priority || 10) - (b.priority || 10);
}
export function SessionsTab() {
    const suffix = React.useMemo(() => UniqueIdManager.getInstance().uniqueId(), []);
    const loadSections = useMemo(() => () => {
        const sectionEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_STARTMENU_SESSION_SECTION).map((d) => d).sort(byPriority);
        return Promise.all(sectionEntries.map((section) => section.load()));
    }, []);
    const { status, value: items } = useAsync(loadSections);
    return (React.createElement(React.Fragment, null, status === 'success' ?
        React.createElement(OrdinoScrollspy, { items: items.map((item) => ({ id: `${item.desc.id}_${suffix}`, name: item.desc.name })) }, (handleOnChange) => React.createElement(React.Fragment, null,
            React.createElement(Container, { className: "pb-10 pt-5" },
                React.createElement(Row, null,
                    React.createElement(Col, null, items === null || items === void 0 ? void 0 : items.map((item, index) => {
                        return (
                        // `id` attribute must match the one in the scrollspy
                        React.createElement(InView, { as: "div", className: `${(index > 0) ? 'pt-3' : ''} ${(index < items.length - 1) ? 'pb-5' : ''}`, id: `${item.desc.id}_${suffix}`, key: item.desc.id, onChange: (inView, entry) => handleOnChange(`${item.desc.id}_${suffix}`, inView, entry) },
                            React.createElement(item.factory, Object.assign({}, item.desc))));
                    })))),
            React.createElement(BrowserRouter, { basename: "/#" },
                React.createElement(OrdinoFooter, { openInNewWindow: true }))))
        : null));
}
//# sourceMappingURL=SessionsTab.js.map