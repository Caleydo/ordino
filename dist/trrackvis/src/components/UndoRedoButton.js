import React from 'react';
import { Button } from 'semantic-ui-react';
import { style } from 'typestyle';
function UndoRedoButton({ graph, undoCallback, redoCallback, }) {
    if (graph === undefined) {
        return null;
    }
    const isAtRoot = graph.root === graph.current;
    const isAtLatest = graph.nodes[graph.current].children.length === 0;
    const margin = {
        marginRight: '3px',
    };
    return (React.createElement("div", null,
        React.createElement(Button, { variant: "outlined", className: undoButtonStyle, disabled: isAtRoot, onClick: undoCallback },
            React.createElement("i", { style: margin, className: "fas fa-undo marginRight" }),
            "Undo"),
        React.createElement(Button, { variant: "outlined", className: redoButtonStyle, disabled: isAtLatest, onClick: redoCallback },
            React.createElement("i", { style: margin, className: "fas fa-redo marginRight" }),
            "Redo")));
}
const undoButtonStyle = style({
    marginTop: '2px',
    borderRadius: '2px',
    display: 'inline-block',
    cursor: 'pointer',
    fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif',
    fontSize: '14px',
    marginRight: '1px',
    $nest: {
        '&:hover': {
            backgroundColor: '#6c7c7c',
        },
        '&:active': {
            backgroundColor: '#6c7c7c',
        },
    },
});
const redoButtonStyle = style({
    marginTop: '2px',
    borderRadius: '2px',
    display: 'inline-block',
    cursor: 'pointer',
    fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif',
    fontSize: '14px',
    $nest: {
        '&:hover': {
            backgroundColor: '#6c7c7c',
        },
        '&:active': {
            backgroundColor: '#6c7c7c',
        },
    },
});
export default UndoRedoButton;
//# sourceMappingURL=UndoRedoButton.js.map