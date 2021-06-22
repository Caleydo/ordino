import * as React from 'react';
import { Link } from 'react-router-dom';
import { OrdinoLogo } from './OrdinoLogo';
// tslint:disable-next-line: variable-name
const FooterLink = (props) => {
    if (props.openInNewWindow) {
        return (React.createElement(Link, { to: props.to, className: props.className, target: "_blank", rel: "noopener noreferrer" }, props.children));
    }
    return (React.createElement(Link, { to: props.to, className: props.className }, props.children));
};
export function OrdinoFooter(props) {
    const openInNewWindow = !!props.openInNewWindow; // undefined and null = false (default)
    return (React.createElement("div", { className: "ordino-footer pt-4 pb-6 px-5" },
        React.createElement("nav", { className: "ordino-footer-navigation row" },
            React.createElement("div", { className: "list-group" },
                React.createElement(FooterLink, { to: "/news", openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "me-2 fas fa-fw fa-newspaper" }),
                    "What's new?"),
                React.createElement(FooterLink, { to: "/features", openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "me-2 fas fa-fw fa-check" }),
                    "Features"),
                React.createElement(FooterLink, { to: "/datasets", openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "me-2 fas fa-fw fa-database" }),
                    "Loaded datasets"),
                React.createElement(FooterLink, { to: "/publication", openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "me-2 fas fa-fw fa-book-open" }),
                    "Publications")),
            React.createElement("div", { className: "list-group" },
                React.createElement(FooterLink, { to: "/help/ordino-at-a-glance", openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "me-2 fas fa-fw fa-mountain" }),
                    "Ordino at a glance"),
                React.createElement(FooterLink, { to: "/help/contact-us", openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "me-2 fas fa-fw fa-at" }),
                    "Contact us"),
                React.createElement(FooterLink, { to: "/help/disclaimer", openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "me-2 fas fa-fw fa-exclamation-triangle" }),
                    "Disclaimer"),
                React.createElement(FooterLink, { to: "/help/terms-of-use", openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "me-2 fas fa-fw fa-smile" }),
                    "Terms of use"),
                React.createElement(FooterLink, { to: "/help/source-code-licenses", openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "me-2 fas fa-fw fa-code" }),
                    "Source code ",
                    '&',
                    " licenses"))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col position-relative text-end ordino-footer-logo" },
                React.createElement(FooterLink, { to: "/", openInNewWindow: openInNewWindow },
                    React.createElement(OrdinoLogo, null))))));
}
//# sourceMappingURL=OrdinoFooter.js.map