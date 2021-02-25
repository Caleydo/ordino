import React from 'react';
import {CommonSessionCard} from './CommonSessionCard';
import {SessionDropzone} from './SessionDropzone';


export function UploadSessionCard() {
    return (
        <CommonSessionCard cardName="Import Session" faIcon="fa-file-upload" cardInfo="You can import sessions as temporary sessions and continue the analysis afterwards.">
            {() => <SessionDropzone />}
        </CommonSessionCard>
    );

}
