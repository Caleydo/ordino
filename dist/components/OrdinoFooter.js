import * as React from 'react';
import { Link } from 'react-router-dom';
import { OrdinoLogo } from './OrdinoLogo';
import { PluginRegistry } from 'phovea_core';
import { EP_ORDINO_FOOTER_MENU } from '../base';
// tslint:disable-next-line: variable-name
const FooterLink = (props) => {
    if (props.openInNewWindow) {
        return (React.createElement(Link, { to: props.to, className: props.className, target: "_blank", rel: "noopener noreferrer" }, props.children));
    }
    return (React.createElement(Link, { to: props.to, className: props.className }, props.children));
};
export function OrdinoFooter(props) {
    const openInNewWindow = !!props.openInNewWindow; // undefined and null = false (default)
    const lists = PluginRegistry.getInstance().listPlugins(EP_ORDINO_FOOTER_MENU)
        .map((d) => d) // no need to load the plugin; everything is contained in the plugin desc
        .map((d) => d.lists)[0]; // take only the first footer menu
    return (React.createElement("div", { className: "ordino-footer pt-4 pb-6 px-5" },
        React.createElement("nav", { className: "ordino-footer-navigation row" }, lists && lists.map((list, index) => {
            return (React.createElement("div", { className: "list-group", key: index }, list && list.map((link) => {
                return (React.createElement(FooterLink, { key: link.page, to: link.page, openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: `mr-2 ${link.faIcon}` }),
                    " ",
                    link.text));
            })));
        })),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col text-right ordino-footer-logo" },
                React.createElement(FooterLink, { to: "/", openInNewWindow: openInNewWindow },
                    React.createElement(OrdinoLogo, null))))));
}
//# sourceMappingURL=OrdinoFooter.js.map