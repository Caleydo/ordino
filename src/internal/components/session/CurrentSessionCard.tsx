import React from 'react';
import {Card} from 'react-bootstrap';
import {CurrentSessionListItem} from '..';


export function CurrentSessionCard() {
    return (
        <>
            <h4 className="text-left d-flex align-items-center mb-3"><i className="mr-2 ordino-icon-2 fas fa-history" ></i>Current Session</h4>
            <Card className="shadow-sm">
                <Card.Body className="p-3">
                    <Card.Text>
                        Save the current session to open it later again or share it with other users.
                </Card.Text>
                    <CurrentSessionListItem name="Temporary Session 159" uploadedDate="a minute ago" />
                </Card.Body>
            </Card>
        </>
    );

}
