import {I18nextManager} from 'phovea_core';
import React from 'react';
import {Card} from 'react-bootstrap';
import {TDPApplicationUtils} from 'tdp_core';
import {TemporarySessionListItem} from '..';
import {useAsync} from '../../../hooks';
import {GraphContext} from '../../menu/StartMenuReact';


export function CurrentSessionCard() {
    const {manager} = React.useContext(GraphContext);
    const listSessions = React.useMemo(() => () => manager.list(), []);
    const {status, value, error} = useAsync(listSessions);
    // I am not sure this is the best way to get the current session
    const current = value?.[value?.length - 1];
    return (
        <>
            <h4 className="text-left d-flex align-items-center mb-3"><i className="mr-2 ordino-icon-2 fas fa-history" ></i>Current Session</h4>
            <Card className="shadow-sm">
                <Card.Body className="p-3">
                    <Card.Text>
                        Save the current session to open it later again or share it with other users.
                </Card.Text>
                    <TemporarySessionListItem status={status} value={current} error={error} />
                </Card.Body>
            </Card>
        </>
    );

}
