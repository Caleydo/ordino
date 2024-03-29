import React from 'react';
import Dropzone from 'react-dropzone';
import { GraphContext } from '../../constants';

export function SessionDropzone() {
  const { manager } = React.useContext(GraphContext);
  const onDrop = (acceptedFile) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const dataS = e.target.result;
      const dump = JSON.parse(dataS);
      manager.importGraph(dump);
    };
    reader.readAsText(acceptedFile[0]);
  };

  return (
    <Dropzone multiple={false} maxFiles={1} accept=".json" onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="session-dropzone" data-testid="session-dropzone">
              <p className="text-center mt-2 mb-1">Drop session file here or click to upload</p>
              <p className="text-center">Accepted file formats: JSON file</p>
            </div>
          </div>
        </section>
      )}
    </Dropzone>
  );
}
