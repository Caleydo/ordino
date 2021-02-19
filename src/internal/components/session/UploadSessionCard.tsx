import React from 'react';
import {Card} from 'react-bootstrap';
import {SessionDropzone} from '..';


export function UploadSessionCard() {
    return (
        <>  <h4 className="text-left mt-4 mb-3"><i className="mr-2 fas ordino-icon-2 fa-file-upload" ></i> Import Session</h4>
            <Card className="shadow-sm">
                <Card.Body className="p-3">
                    <Card.Text>
                        You can import sessions as temporary sessions and continue the analysis afterwards.
                    </Card.Text>
                    <SessionDropzone />
                </Card.Body>
            </Card>

        </>
    );

}
