import * as React from 'react';
import Card from 'react-bootstrap/Card';
import {Row, Col, Button} from 'react-bootstrap';

interface ITourCardProps {
    image: string;
    title: string;
    text: string;
    onClickHandler: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
    children?: React.ReactNode;
}

export function TourCard({image, title, text, onClickHandler}: ITourCardProps) {
    return (
        <Col>
            <Card className="ordino-tour-card shadow-sm">
                <Card.Img style={{height: '200px'}} variant="top" className="p-2" src={image} />
                <Card.Body className="p-2">
                    <Card.Title>{title}</Card.Title>
                    <Card.Text>
                        {text}
                    </Card.Text>
                    <Button className="btn btn-light" onClick={onClickHandler}><i className="mr-1 fas fa-angle-right"></i> Start Tour</Button>
                </Card.Body>
            </Card>
        </Col>
    );
}
