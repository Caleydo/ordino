import * as React from 'react';
import { Link } from 'react-router-dom';
import { OrdinoLogo } from './OrdinoLogo';
const footerLink = React.forwardRef((props, ref) => {
    if (props.openInNewWindow) {
        return (React.createElement("a", { href: props.href, className: props.className, target: "_blank", rel: "noopener noreferrer" }, props.children));
    }
    return (React.createElement("a", { href: props.href, className: props.className }, props.children));
});
export function OrdinoFooter(props) {
    const openInNewWindow = !!props.openInNewWindow; // undefined and null = false (default)
    return (React.createElement("div", { className: "ordino-footer pt-4 pb-6 px-5" },
        React.createElement("nav", { className: "ordino-footer-navigation row" },
            React.createElement("div", { className: "list-group" },
                React.createElement(Link, { to: "/news", component: footerLink, openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "mr-2 fas fa-fw fa-newspaper" }),
                    "What's new?"),
                React.createElement(Link, { to: "/features", component: footerLink, openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "mr-2 fas fa-fw fa-check" }),
                    "Features"),
                React.createElement(Link, { to: "/datasets", component: footerLink, openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "mr-2 fas fa-fw fa-database" }),
                    "Loaded Datasets"),
                React.createElement(Link, { to: "/publication", component: footerLink, openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "mr-2 fas fa-fw fa-book-open" }),
                    "Publication")),
            React.createElement("div", { className: "list-group" },
                React.createElement(Link, { to: "/help", component: footerLink, openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "mr-2 fas fa-fw fa-question" }),
                    "Help and Contact"),
                React.createElement(Link, { to: "/help", component: footerLink, openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "mr-2 fas fa-fw fa-file-code" }),
                    "Source Code & Licenses"),
                React.createElement(Link, { to: "/help", component: footerLink, openInNewWindow: openInNewWindow, className: "list-group-item list-group-item-action" },
                    React.createElement("i", { className: "mr-2 fas fa-fw fa-smile" }),
                    "Terms of Use"))),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col text-right ordino-footer-logo" },
                React.createElement(Link, { to: "/", component: footerLink, openInNewWindow: openInNewWindow },
                    React.createElement(OrdinoLogo, null))))));
}
//# sourceMappingURL=OrdinoFooter.js.map