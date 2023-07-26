/* eslint-disable react/no-danger */
import { I18nextManager } from 'visyn_core/i18n';
import * as React from 'react';
import parse from 'html-react-parser';
export function TourCard({ id, image, title, text, onClickHandler, href }) {
    return (React.createElement("div", { className: "mb-3 col position-relative", "data-testid": "tour-card" },
        React.createElement("div", { className: "card ordino-tour-card shadow-sm", "data-id": id, "data-testid": id },
            image ? React.createElement("img", { className: "card-img-top p-2", src: image, alt: "Teaser image of the tour" }) : null,
            React.createElement("div", { className: "card-body p-2" },
                React.createElement("h5", { className: "card-title" }, title),
                React.createElement("p", { className: "card-text" }, parse(text)),
                React.createElement("a", { className: "btn btn-light", title: I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.startTour'), href: href, onClick: onClickHandler, "data-testid": "start-tour-button" },
                    React.createElement("i", { className: "me-1 fas fa-angle-right" }),
                    " ",
                    I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.startTour'))))));
}
//# sourceMappingURL=TourCard.js.map