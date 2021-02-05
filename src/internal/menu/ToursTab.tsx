import * as React from 'react';
import {Row, Col, Nav, Container, Button, Form, Card, ListGroup, Navbar} from 'react-bootstrap';
import {Waypoint} from 'react-waypoint';
import {useRef} from 'react';
import * as ReactDOM from 'react-dom';
import feature1Img from 'ordino_public/dist/assets/feature_1.png';
import feature2Img from 'ordino_public/dist/assets/feature_2.png';
import feature3Img from 'ordino_public/dist/assets/feature_3.png';
import {TourCard} from '../components/TourCard';


export const ToursTab = () => {
  return (
    <Container className="mt-4 mb-6 tours-tab">
      <Row>
        <Col>
          <p className="ordino-info-text"> Learn more about Ordino by taking an interactive guided tour</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4 className="text-left mt-4 mb-3  d-flex align-items-center "><i className="mr-2 ordino-icon-1 fas fa-chevron-circle-right" ></i> Beginner</h4>
        </Col>
      </Row>
      <Row md={3}>
        <TourCard title="Ordino Welcome Tour" text="Learn the basic features of Ordino in a short welcome tour." image={feature1Img} onClickHandler={(evt) => console.log("hello")}></TourCard>
        <TourCard title="Overview of Start Menu" text="This tour provides an overview of the Ordino start menu." image={feature2Img} onClickHandler={(evt) => console.log("hello")}></TourCard>
      </Row>
      <Row className="mt-4" >
        <Col>
          <h4 className="text-left mt-4 mb-3  d-flex align-items-center "><i className="mr-2 ordino-icon-1 fas fa-chevron-circle-right" ></i> Advanced</h4>
        </Col>
      </Row>
      <Row md={3}>
        <TourCard title="Adding data Columns" text="Learn how to add data columns to rankings in Ordino." image={feature3Img} onClickHandler={(evt) => console.log("hello")}></TourCard>
      </Row>
    </Container >
  )
}
