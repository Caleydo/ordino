import React from 'react';
import Select from 'react-select';
import { Button, Col, Row } from 'react-bootstrap';
export function DatasetSearchBox({}) {
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ];
    return (React.createElement(Row, null,
        React.createElement(Col, null,
            React.createElement(Select, { isMulti: true, options: options })),
        React.createElement(Button, { variant: "secondary", className: "mr-2 pt-1 pb-1" }, "Open"),
        React.createElement(Button, { variant: "outline-secondary", className: "mr-2 pt-1 pb-1" }, "Save as set")));
}
//# sourceMappingURL=DatasetSearchBox.js.map