import React from 'react';
export function ViewChooserFooter(props) {
    return React.createElement("div", { className: "chooser-footer border-top border-light d-flex justify-content-center" },
        props.children,
        React.createElement("button", { className: "btn btn-icon-gray btn-lg" },
            React.createElement("i", { className: "fab fa-github" })));
}
//# sourceMappingURL=ViewChooserFooter.js.map