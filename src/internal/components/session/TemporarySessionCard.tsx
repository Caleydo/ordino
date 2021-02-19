import React from 'react';
import {Card} from 'react-bootstrap';
import {CurrentSessionListItem} from '..';


export function TemporarySessionCard() {
    return (
        <>
            <h4 className="text-left mt-4 mb-3"><i className="mr-2 ordino-icon-2 fas fa-history" ></i>Temporary Sessions</h4>
            <Card className="shadow-sm">
                <Card.Body className="p-3">
                    <Card.Text>
                        A temporary session will only be stored in your local browser cache.It is not possible to share a link to states
                        of this session with others. Only the 10 most recent sessions will be stored.
        </Card.Text>
                    <CurrentSessionListItem name="Temporary session 20" uploadedDate="a minute ago" />
                    <CurrentSessionListItem name="Temporary session 19" uploadedDate="5 minutes ago" />
                    <CurrentSessionListItem name="Temporary session 18" uploadedDate="10 minutes ago" />
                    <CurrentSessionListItem name="Temporary session 17" uploadedDate="15 minutes ago" />
                </Card.Body>
            </Card>
        </>
    );

}
