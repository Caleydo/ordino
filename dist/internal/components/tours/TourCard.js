import { I18nextManager } from 'tdp_core';
import * as React from 'react';
export function TourCard({ id, image, title, text, onClickHandler, href }) {
    return (React.createElement("div", { className: "col position-relative", "data-testid": "tourcard" },
        React.createElement("div", { className: "card ordino-tour-card shadow-sm", "data-id": id, "data-testid": id },
            image ? React.createElement("img", { className: "card-img-top p-2", style: { height: '200px' }, src: image, alt: "Tour Image" }) : null,
            React.createElement("div", { className: "card-body p-2" },
                React.createElement("h5", { className: "card-title" }, title),
                React.createElement("p", { className: "card-text" }, text),
                React.createElement("a", { className: "btn btn-light", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.startTour'), href: href, onClick: onClickHandler, "data-testid": "startTour-button" },
                    React.createElement("i", { className: "me-1 fas fa-angle-right" }),
                    " ",
                    I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.startTour'))))));
}
//# sourceMappingURL=TourCard.js.map