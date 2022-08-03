/* eslint-disable import/no-cycle */
import React from 'react';
import { TextField, Button, Card, CardContent, CardActions } from '@mui/material';
import { isStateNode } from '@trrack/core';
export function AnnotationField({ config, node, setAnnotationDepth, }) {
    const [value, setValue] = React.useState(isStateNode(node) ? config.getAnnotation(node.id) : 'Test');
    const handleChange = (event) => {
        setValue(event.target.value);
    };
    return (React.createElement(Card, null,
        React.createElement(CardContent, null,
            React.createElement(TextField, { fullWidth: true, multiline: true, label: "Annotation", inputProps: {
                    style: {
                        fontSize: '12px',
                    },
                }, value: value, onChange: handleChange })),
        React.createElement(CardActions, null,
            React.createElement("div", { style: { display: 'flex' } },
                React.createElement(Button, { onClick: () => setAnnotationDepth(null) }, "Close"),
                React.createElement(Button, { onClick: () => {
                        setAnnotationDepth(null);
                        config.annotateNode(node.id, value);
                    } }, "Annotate")))));
}
//# sourceMappingURL=AnnotationField.js.map