import * as React from 'react';
export function TourCard({ image, title, text, onClickHandler, href }) {
    return (React.createElement("div", { className: "col" },
        React.createElement("div", { className: "card ordino-tour-card shadow-sm" },
            image ?
                React.createElement("img", { className: "card-img-top p-2", style: { height: '200px' }, src: image })
                : null,
            React.createElement("div", { className: "card-body p-2" },
                React.createElement("h5", { className: "card-title" }, title),
                React.createElement("p", { className: "card-text" }, text),
                React.createElement("a", { className: "btn btn-light", href: href, onClick: onClickHandler },
                    React.createElement("i", { className: "mr-1 fas fa-angle-right" }),
                    " Start Tour")))));
}
//# sourceMappingURL=TourCard.js.map