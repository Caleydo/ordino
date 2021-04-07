import React, { useMemo } from 'react';
import { Row, Container } from 'react-bootstrap';
import { TourCard, OrdinoScrollspy } from '../../components';
import { BrowserRouter } from 'react-router-dom';
import { OrdinoFooter } from '../../../components';
import tour1Img from 'ordino/dist/assets/tour_1.png';
import { TourUtils } from 'tdp_core';
import { PluginRegistry } from 'phovea_core';
import { useAsync } from '../../../hooks';
export function ToursTab() {
    const loadTours = useMemo(() => () => {
        const tourEntries = PluginRegistry.getInstance().listPlugins(TourUtils.EXTENSION_POINT_TDP_TOUR).map((d) => d);
        return Promise.all(tourEntries.map((tour) => tour.load()));
    }, []);
    const { status, value: tours } = useAsync(loadTours);
    const beginnerTours = tours === null || tours === void 0 ? void 0 : tours.filter((tour) => tour.desc.level === 'beginner');
    const advancedTours = tours === null || tours === void 0 ? void 0 : tours.filter((tour) => tour.desc.level === 'advanced');
    return (React.createElement(React.Fragment, null, status === 'success' ?
        React.createElement(OrdinoScrollspy, null,
            React.createElement(Container, { className: "pb-10 pt-5 tours-tab" },
                React.createElement("p", { className: "lead text-ordino-gray-4" }, "Learn more about Ordino by taking an interactive guided tour"),
                beginnerTours ?
                    React.createElement(ToursSection, { level: 'beginner', tours: beginnerTours })
                    : null,
                advancedTours ?
                    React.createElement(ToursSection, { level: 'advanced', tours: advancedTours })
                    : null),
            React.createElement(BrowserRouter, { basename: "/#" },
                React.createElement(OrdinoFooter, { openInNewWindow: true }))) : null));
}
function ToursSection(props) {
    if (props.tours.length === 0) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("h4", { className: "text-left mt-4 mb-3  d-flex align-items-center" },
            React.createElement("i", { className: "mr-2 ordino-icon-1 fas fa-chevron-circle-right" }),
            " ",
            props.level),
        React.createElement(Row, { className: "mb-4", md: 3 }, props.tours.map((tour) => {
            return React.createElement(TourCard, { key: tour.desc.id, title: tour.desc.name, text: tour.desc.description, image: tour1Img, onClickHandler: (evt) => TourUtils.startTour(tour.desc.id) });
        }))));
}
//# sourceMappingURL=ToursTab.js.map