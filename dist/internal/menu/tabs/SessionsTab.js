import React, { useMemo } from 'react';
import { Container, Col, Row, ListGroup } from 'react-bootstrap';
import { PluginRegistry, UniqueIdManager } from 'phovea_core';
import { useAsync } from '../../../hooks';
import { EP_ORDINO_STARTMENU_SESSION_SECTION } from '../../..';
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
            React.createElement(ListGroup, { variant: "flush", id: "session-tab-scrollspy-nav", className: "scrollspy-nav flex-column ml-4" }, sections === null || sections === void 0 ? void 0 : sections.map((section) => {
                // Important: We cannot use the react-bootstrap `ListGroup.Item` here, because it sets the `active` class automatically at `onClick`.
                // This behavior cannot be supressed and interfers with the Bootstrap scrollspy + `scrollIntoView` which causes a flickering of the navigation items.
                // The only solution is to use a plain `a` element and add the necessary Bootstrap classes here.
                // return(<ListGroup.Item key={section.desc.id} action href={`#${section.desc.id}_${suffix}`} onClick={scrollIntoView} className="pl-0 mt-0 border-0 bg-transparent">{section.desc.name}</ListGroup.Item>);
                return (React.createElement("a", { key: section.desc.id, href: `#${section.desc.id}_${suffix}`, onClick: scrollIntoView, className: "pl-0 mt-0 border-0 bg-transparent list-group-item list-group-item-action" }, section.desc.name));
            })),
            React.createElement(Container, { className: "mb-4" },
                React.createElement(Row, null,
                    React.createElement(Col, null, sections === null || sections === void 0 ? void 0 : sections.map((section, index) => {
                        return (React.createElement("div", { id: `${section.desc.id}_${suffix}`, className: `${(index > 0) ? 'pt-3' : ''} ${(index < sections.length - 1) ? 'pb-5' : ''}`, key: section.desc.id },
                            React.createElement(section.factory, Object.assign({}, section.desc))));
                    })))))
        : null));
}
//# sourceMappingURL=SessionsTab.js.map