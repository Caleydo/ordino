import React from "react"
import {Container, Button, ButtonGroup, Card, Col, Dropdown, Nav, Row, Tab} from 'react-bootstrap'
import Dropzone from 'react-dropzone'

export const ImportSession = () => {
    return (

        <Card style={{}} className="shadow-sm">
            <Card.Body className="p-3">
                <Card.Text>
                    You can import sessions as temporary sessions and continue the analysis afterwards.
                </Card.Text>
                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                    {({getRootProps, getInputProps}) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className="session-dropzone">
                                    <p className="text-center">Drop session file here or click to upload</p>
                                    <p className="text-center" >Accepted file formats: JSON file</p>
                                </div>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </Card.Body>
        </Card>
    )
}
