import React from 'react';
import Dropzone from 'react-dropzone';


export function DatasetDropzone() {
    return (
        <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
                <section>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="session-dropzone ">
                            <p className="text-center mt-2 mb-1">Drop session file here or click to upload</p>
                            <p className="text-center" >Accepted file formats: Microsoft Excel (XLSX), comma or tab-seperated text file</p>
                        </div>
                    </div>
                </section>
            )}
        </Dropzone>
    );
}
