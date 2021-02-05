import React from "react";
import { Card } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
export const ImportSession = () => {
    return (React.createElement(Card, { style: {}, className: "shadow-sm" },
        React.createElement(Card.Body, { className: "p-3" },
            React.createElement(Card.Text, null, "You can import sessions as temporary sessions and continue the analysis afterwards."),
            React.createElement(Dropzone, { onDrop: acceptedFiles => console.log(acceptedFiles) }, ({ getRootProps, getInputProps }) => (React.createElement("section", null,
                React.createElement("div", Object.assign({}, getRootProps()),
                    React.createElement("input", Object.assign({}, getInputProps())),
                    React.createElement("div", { className: "session-dropzone" },
                        React.createElement("p", { className: "text-center" }, "Drop session file here or click to upload"),
                        React.createElement("p", { className: "text-center" }, "Accepted file formats: JSON file")))))))));
};
//# sourceMappingURL=ImportSession.js.map