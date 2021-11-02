import React from 'react';
export interface IDatasetsTabProps {
    extensions?: {
        preExtensions?: React.ReactElement | null;
        postExtensions?: React.ReactElement | null;
        dataLandscape?: React.ReactElement | null;
        entityRelation?: React.ReactElement | null;
    };
}
export default function DatasetsTab({ extensions: { preExtensions, postExtensions, dataLandscape, entityRelation } }: IDatasetsTabProps): JSX.Element;
