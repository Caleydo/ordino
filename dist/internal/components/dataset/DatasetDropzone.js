import React from 'react';
import Dropzone from 'react-dropzone';
export function DatasetDropzone() {
    const onDrop = (acceptedFiles) => {
        // TODO: Implement logic
    };
    return (React.createElement(Dropzone, { multiple: false, maxFiles: 1, accept: ['.txt', '.csv', '.tsv', '.xlsx'], onDrop: (acceptedFiles) => console.log(acceptedFiles) }, ({ getRootProps, getInputProps }) => (React.createElement("section", null,
        React.createElement("div", Object.assign({}, getRootProps()),
            React.createElement("input", Object.assign({}, getInputProps())),
            React.createElement("div", { className: "session-dropzone" },
                React.createElement("p", { className: "text-center mt-2 mb-1" }, "Drop session file here or click to upload"),
                React.createElement("p", { className: "text-center" }, "Accepted file formats: Microsoft Excel (XLSX), comma or tab-seperated text file")))))));
}
//# sourceMappingURL=DatasetDropzone.js.map