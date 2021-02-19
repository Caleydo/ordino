import React from 'react';
import {Card} from 'react-bootstrap';
import {TemporarySessionListItem} from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';


export function TemporarySessionCard() {

    const {manager} = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => () => manager.list(), []);
    const {status, value, error} = useAsync(listSessions);

    return (
        <>
            <h4 className="text-left mt-4 mb-3"><i className="mr-2 ordino-icon-2 fas fa-history" ></i>Temporary Sessions</h4>
            <Card className="shadow-sm">
                <Card.Body className="p-3">
                    <Card.Text>
                        A temporary session will only be stored in your local browser cache.It is not possible to share a link to states
                        of this session with others. Only the 10 most recent sessions will be stored.
                    </Card.Text>
                    {
                        value?.map((tempSession) => <TemporarySessionListItem status={status} value={tempSession} error={error} />)
                    }
                </Card.Body>
            </Card>
        </>
    );
}
