import * as React from 'react';
import { Link } from 'react-router-dom';
import { PluginRegistry } from 'tdp_core';
import { OrdinoLogo } from './OrdinoLogo';
import { EP_ORDINO_FOOTER_MENU } from '../base';
// tslint:disable-next-line: variable-name
function FooterLink(props) {
    const testId = props.to === '/' ? '' : `${props.to.replace(/\s+/g, '-').toLowerCase()}-footerLink`; // check if FooterLink is logo, footer logo should not have data-testid in footerlink
    if (props.openInNewWindow) {
        return (React.createElement(Link, { to: props.to, className: props.className, "data-testid": testId, target: "_blank", rel: "noopener noreferrer" }, props.children));
    }
    return (React.createElement(Link, { to: props.to, className: props.className, "data-testid": testId }, props.children));
}
export function OrdinoFooter(props) {
    const testId = props.testId;
    const openInNewWindow = !!props.openInNewWindow; // undefined and null = false (default)
    const lists = PluginRegistry.getInstance()
        .listPlugins(EP_ORDINO_FOOTER_MENU)
        .map((d) => d) // no need to load the plugin; everything is contained in the plugin desc
        .map((d) => d.lists)[0]; // take only the first footer menu
    return (React.createElement("div", { className: "ordino-footer pt-4 pb-6 px-5", "data-testid": `ordino-footer-${testId}` },
        React.createElement("nav", { className: "ordino-footer-navigation row" }, lists &&
            lists.map((list, index) => {
                return (
                // eslint-disable-next-line react/no-array-index-key
                React.createElement("div", { className: "list-group col-sm-auto", key: index }, list &&
                    list.map((link) => {
                        return (React.createElement(FooterLink, { key: link.page, to: link.page, openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                            link.faIcon && React.createElement("i", { className: `${link.faIcon} me-2` }),
                            link.text));
                    })));
            })),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col position-relative text-end ordino-footer-logo" },
                React.createElement(FooterLink, { to: "/", openInNewWindow: openInNewWindow },
                    React.createElement(OrdinoLogo, null))))));
}
//# sourceMappingURL=OrdinoFooter.js.map