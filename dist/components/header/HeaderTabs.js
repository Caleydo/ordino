import * as React from "react";
export function HeaderTabs() {
    return (React.createElement("ul", { className: "navbar-nav me-auto", "data-header": "mainMenu" },
        React.createElement("li", { className: "nav-item active" },
            React.createElement("a", { className: "nav-link", href: "#ordino_dataset_tab", id: "ordino_dataset_tab-tab", role: "tab", "aria-controls": "ordino_dataset_tab", "aria-selected": "true" }, "Datasets")),
        React.createElement("li", { className: "nav-item " },
            React.createElement("a", { className: "nav-link", href: "#ordino_sessions_tab", id: "ordino_sessions_tab-tab", role: "tab", "aria-controls": "ordino_sessions_tab", "aria-selected": "false" }, "Analysis Sessions")),
        React.createElement("li", { className: "nav-item " },
            React.createElement("a", { className: "nav-link", href: "#ordino_tours_tab", id: "ordino_tours_tab-tab", role: "tab", "aria-controls": "ordino_tours_tab", "aria-selected": "false" }, "Onboarding Tours"))));
}
//# sourceMappingURL=HeaderTabs.js.map