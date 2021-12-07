import React, { useMemo } from 'react';
import { TourCard, OrdinoScrollspy } from '../../components';
import { BrowserRouter } from 'react-router-dom';
import { OrdinoFooter } from '../../../components';
import { TourUtils, useAsync } from 'tdp_core';
import { PluginRegistry, I18nextManager } from 'tdp_core';
export default function ToursTab(_props) {
    const loadTours = useMemo(() => () => {
        const tourEntries = PluginRegistry.getInstance().listPlugins(TourUtils.EXTENSION_POINT_TDP_TOUR).map((d) => d);
        return Promise.all(tourEntries.map((tour) => tour.load()));
    }, []);
    const { status, value: tours } = useAsync(loadTours, []);
    const beginnerTours = tours === null || tours === void 0 ? void 0 : tours.filter((tour) => tour.desc.level === 'beginner');
    const advancedTours = tours === null || tours === void 0 ? void 0 : tours.filter((tour) => tour.desc.level === 'advanced');
    return (React.createElement(React.Fragment, null, status === 'success' ?
        React.createElement(OrdinoScrollspy, null,
            React.createElement("div", { className: "container pb-10 pt-5 tours-tab" },
                React.createElement("p", { className: "lead text-gray-600" }, "Learn more about Ordino by taking an interactive guided tour"),
                beginnerTours ?
                    React.createElement(ToursSection, { level: "beginner", tours: beginnerTours })
                    : null,
                advancedTours ?
                    React.createElement(ToursSection, { level: "advanced", tours: advancedTours })
                    : null),
            React.createElement(BrowserRouter, { basename: "/#" },
                React.createElement(OrdinoFooter, { openInNewWindow: true, testId: "tours-tab" }))) : null));
}
export function ToursSection(props) {
    if (props.tours.length === 0) {
        return null;
    }
    const loadTourImages = useMemo(() => () => {
        return Promise.all(props.tours.map(async (tour) => {
            if (!tour.desc.preview) { // preview function is optional
                return Promise.resolve(null);
            }
            const module = await tour.desc.preview(); // uses `import('/my/asset.jpg')` to load image as module
            return module.default; // use default export of module -> contains the URL as string from Webpack loader
        }));
    }, [props.tours]);
    const { status, value: images } = useAsync(loadTourImages, []);
    return (React.createElement(React.Fragment, null, status === 'success' ?
        React.createElement(React.Fragment, null,
            React.createElement("h4", { className: "text-start mt-4 mb-3  d-flex align-items-center text-capitalize" },
                React.createElement("i", { className: "me-2 ordino-icon-1 fas fa-chevron-circle-right" }),
                " ",
                (props.level === 'beginner') ? I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tourLevelBeginner') : I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.tourLevelAdvanced')),
            React.createElement("div", { className: "mb-4 row row-cols-md-3", "data-testid": "tourssection" }, props.tours.map((tour, index) => {
                // either hrefBase or onClickHandler
                const href = (props.hrefBase) ? props.hrefBase.replace('{id}', tour.desc.id) : null;
                const onClickHandler = (!props.hrefBase) ? (evt) => TourUtils.startTour(tour.desc.id) : null;
                return React.createElement(TourCard, { key: tour.desc.id, id: tour.desc.id, title: tour.desc.name, text: tour.desc.description, image: (images === null || images === void 0 ? void 0 : images[index]) || null, onClickHandler: onClickHandler, href: href });
            })))
        : null));
}
//# sourceMappingURL=ToursTab.js.map