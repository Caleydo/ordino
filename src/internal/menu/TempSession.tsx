import React from "react"
import {Container, Button, ButtonGroup, Card, Col, Dropdown, Nav, Row, Tab} from 'react-bootstrap'
import {SessionItem} from '../components/SessionItem'

export const TempSessions = () => {
    return (
        <Card style={{}} className="shadow-sm">
            <Card.Body className="p-3">
                <Card.Text>
                    A temporary session will only be stored in your local browser cache.It is not possible to share a link to states
                    of this session with others. Only the 10 most recent sessions will be stored.
                </Card.Text>
                <SessionItem title="Temporary session 20"/>
                <SessionItem title="Temporary session 19"/>
                <SessionItem title="Temporary session 18"/>
                <SessionItem title="Temporary session 17"/>
            </Card.Body>
        </Card>
    )
}



