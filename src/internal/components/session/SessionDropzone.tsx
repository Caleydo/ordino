import React from 'react';
import Dropzone from 'react-dropzone';
import {AppContext} from '../../menu/StartMenuReact';

export function SessionDropzone() {
    const {app} = React.useContext(AppContext);
    const onDrop = (acceptedFile) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const dataS = e.target.result;
            const dump = JSON.parse(dataS);
            app.graphManager.importGraph(dump);
        };
        reader.readAsText(acceptedFile[0]);
    };

    return (
        <Dropzone
            multiple={false}
            maxFiles={1}
            accept={'.json'}
            onDrop={onDrop}
        >
            {({getRootProps, getInputProps}) => (
                <section>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="session-dropzone">
                            <p className="text-center mt-2 mb-1">Drop session file here or click to upload</p>
                            <p className="text-center" >Accepted file formats: JSON file</p>
                        </div>
                    </div>
                </section>
            )}
        </Dropzone>
    );
}
