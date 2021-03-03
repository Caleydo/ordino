import React from 'react';
import {IStartMenuSectionDesc} from '../../..';
import {CommonSessionCard} from './CommonSessionCard';
import {SessionDropzone} from './SessionDropzone';


export default function UploadSessionCard({name, faIcon, cssClass}: IStartMenuSectionDesc) {
    return (
        <CommonSessionCard cardName={name} faIcon={faIcon} cardInfo="You can import sessions as temporary sessions and continue the analysis afterwards.">
            {() => <SessionDropzone />}
        </CommonSessionCard>
    );

}
