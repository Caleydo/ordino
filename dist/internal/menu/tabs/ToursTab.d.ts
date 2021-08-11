/// <reference types="react" />
import { ITDPTourExtension } from 'tdp_core';
import { IPlugin } from 'phovea_core';
import { IStartMenuTabProps } from '../StartMenu';
export default function ToursTab(_props: IStartMenuTabProps): JSX.Element;
export declare function ToursSection(props: {
    level: 'beginner' | 'advanced';
    tours: (IPlugin & ITDPTourExtension)[];
    hrefBase?: string;
}): JSX.Element;
