import React, { useMemo } from 'react';
import { Container, Col, Nav, Row } from 'react-bootstrap';
import { Link, Element } from 'react-scroll';
import { PluginRegistry, UniqueIdManager } from 'phovea_core';
import { useAsync } from '../../../hooks';
import { EP_ORDINO_STARTMENU_SESSION_SECTION } from '../../..';
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
        React.createElement(React.Fragment, null,
            React.createElement(Nav, { className: "scrollspy-nav flex-column ml-4" }, sections === null || sections === void 0 ? void 0 : sections.map((section) => React.createElement(Link, { className: "nav-link", key: section.desc.id, role: "button", to: `${section.desc.id}-${suffix}`, spy: true, smooth: true, offset: -300, duration: 500 }, section.desc.name))),
            React.createElement(Container, { className: "mb-4 analysis-tab" },
                React.createElement(Row, null,
                    React.createElement(Col, null, sections === null || sections === void 0 ? void 0 : sections.map((section, i) => {
                        return (React.createElement(Element, { className: `${i === 0 || 'pt-6'}`, key: section.desc.id, name: `${section.desc.id}-${suffix}` },
                            React.createElement(section.factory, Object.assign({}, section.desc))));
                    })))),
            React.createElement(OrdinoFooter, { openInNewWindow: true }))
        : null));
}
//# sourceMappingURL=SessionsTab.js.map