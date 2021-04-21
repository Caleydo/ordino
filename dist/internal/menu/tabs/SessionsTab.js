import React, { useMemo } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
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
    const suffix = UniqueIdManager.getInstance().uniqueId();
    const loadSections = useMemo(() => () => {
        const sectionEntries = PluginRegistry.getInstance().listPlugins(EP_ORDINO_STARTMENU_SESSION_SECTION).map((d) => d).sort(byPriority);
        return Promise.all(sectionEntries.map((section) => section.load()));
    }, []);
    const { status, value: sections } = useAsync(loadSections);
    return (React.createElement(React.Fragment, null, status === 'success' ?
        React.createElement(OrdinoScrollspy, { items: sections.map((section) => ({ id: `${section.desc.id}_${suffix}`, name: section.desc.name })) },
            React.createElement(Container, { className: "pb-10 pt-5" },
                React.createElement(Row, null,
                    React.createElement(Col, null, sections === null || sections === void 0 ? void 0 : sections.map((section, index) => {
                        return (
                        // `id` attribute must match the one in the scrollspy
                        React.createElement("div", { id: `${section.desc.id}_${suffix}`, className: `${(index > 0) ? 'pt-3' : ''} ${(index < sections.length - 1) ? 'pb-5' : ''}`, key: section.desc.id },
                            React.createElement(section.factory, Object.assign({}, section.desc))));
                    })))),
            React.createElement(BrowserRouter, { basename: "/#" },
                React.createElement(OrdinoFooter, { openInNewWindow: true })))
        : null));
}
//# sourceMappingURL=SessionsTab.js.map