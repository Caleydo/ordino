import * as React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import feature1Img from 'ordino_public/dist/assets/feature_1.png';
import feature2Img from 'ordino_public/dist/assets/feature_2.png';
import feature3Img from 'ordino_public/dist/assets/feature_3.png';
import { TourCard } from '../components/TourCard';
export const ToursTab = () => {
    return (React.createElement(Container, { className: "mt-4 mb-6 tours-tab" },
        React.createElement(Row, null,
            React.createElement(Col, null,
                React.createElement("p", { className: "ordino-info-text" }, " Learn more about Ordino by taking an interactive guided tour"))),
        React.createElement(Row, null,
            React.createElement(Col, null,
                React.createElement("h4", { className: "text-left mt-4 mb-3  d-flex align-items-center " },
                    React.createElement("i", { className: "mr-2 ordino-icon-1 fas fa-chevron-circle-right" }),
                    " Beginner"))),
        React.createElement(Row, { md: 3 },
            React.createElement(TourCard, { title: "Ordino Welcome Tour", text: "Learn the basic features of Ordino in a short welcome tour.", image: feature1Img, onClickHandler: (evt) => console.log("hello") }),
            React.createElement(TourCard, { title: "Overview of Start Menu", text: "This tour provides an overview of the Ordino start menu.", image: feature2Img, onClickHandler: (evt) => console.log("hello") })),
        React.createElement(Row, { className: "mt-4" },
            React.createElement(Col, null,
                React.createElement("h4", { className: "text-left mt-4 mb-3  d-flex align-items-center " },
                    React.createElement("i", { className: "mr-2 ordino-icon-1 fas fa-chevron-circle-right" }),
                    " Advanced"))),
        React.createElement(Row, { md: 3 },
            React.createElement(TourCard, { title: "Adding data Columns", text: "Learn how to add data columns to rankings in Ordino.", image: feature3Img, onClickHandler: (evt) => console.log("hello") }))));
};
//# sourceMappingURL=ToursTab.js.map