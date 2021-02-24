import React from 'react';
import {Card} from 'react-bootstrap';

interface ICommonSessionCardProps {
    cardName: string;
    faIcon: string;
    cardInfo?: string;
    children?: React.ReactNode;
}

export function CommonSessionCard({cardName, faIcon, cardInfo, children}: ICommonSessionCardProps) {
    return <>

        <h4 className="text-left d-flex align-items-center mb-3"><i className={`mr-2 ordino-icon-2 fas ${faIcon}`} ></i>{cardName}</h4>
        <Card className="shadow-sm">
            <Card.Body className="p-3">
                {cardInfo || <Card.Text>
                    {cardInfo}
                </Card.Text>}
                {children}
            </Card.Body>
        </Card>
    </>;
}
