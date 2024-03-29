import React from 'react';
import Dropzone from 'react-dropzone';
import { GraphContext } from '../../constants';
export function SessionDropzone() {
    const { manager } = React.useContext(GraphContext);
    const onDrop = (acceptedFile) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataS = e.target.result;
            const dump = JSON.parse(dataS);
            manager.importGraph(dump);
        };
        reader.readAsText(acceptedFile[0]);
    };
    return (React.createElement(Dropzone, { multiple: false, maxFiles: 1, accept: ".json", onDrop: onDrop }, ({ getRootProps, getInputProps }) => (React.createElement("section", null,
        React.createElement("div", { ...getRootProps() },
            React.createElement("input", { ...getInputProps() }),
            React.createElement("div", { className: "session-dropzone", "data-testid": "session-dropzone" },
                React.createElement("p", { className: "text-center mt-2 mb-1" }, "Drop session file here or click to upload"),
                React.createElement("p", { className: "text-center" }, "Accepted file formats: JSON file")))))));
}
//# sourceMappingURL=SessionDropzone.js.map