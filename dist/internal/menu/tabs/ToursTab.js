import * as React from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import tour1Img from 'ordino/dist/assets/tour_1.png';
import { TourCard } from '../../components/TourCard';
export function ToursTab() {
    return (React.createElement(Container, { fluid: true, className: "mb-6 tours-tab" },
        React.createElement(Row, null,
            React.createElement(Col, { className: "d-flex justify-content-end" },
                React.createElement(Button, { className: "start-menu-close", variant: "link" },
                    React.createElement("i", { className: "fas fa-times" })))),
        React.createElement(Container, null,
            React.createElement("p", { className: "ordino-info-text" }, " Learn more about Ordino by taking an interactive guided tour"),
            React.createElement("h4", { className: "text-left mt-4 mb-3  d-flex align-items-center " },
                React.createElement("i", { className: "mr-2 ordino-icon-1 fas fa-chevron-circle-right" }),
                " Beginner"),
            React.createElement(Row, { className: "mb-4", md: 3 },
                React.createElement(TourCard, { title: "Ordino Welcome Tour", text: "Learn the basic features of Ordino in a short welcome tour.", image: tour1Img, onClickHandler: (evt) => console.log('') }),
                React.createElement(TourCard, { title: "Overview of Start Menu", text: "This tour provides an overview of the Ordino start menu.", image: tour1Img, onClickHandler: (evt) => console.log('') })),
            React.createElement("h4", { className: "text-left mt-4 mb-3  d-flex align-items-center " },
                React.createElement("i", { className: "mr-2 ordino-icon-1 fas fa-chevron-circle-right" }),
                " Advanced"),
            React.createElement(Row, { md: 3 },
                React.createElement(TourCard, { title: "Adding data Columns", text: "Learn how to add data columns to rankings in Ordino.", image: tour1Img, onClickHandler: (evt) => console.log('') })))));
}
//# sourceMappingURL=ToursTab.js.map