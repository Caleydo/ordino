import { ITDPTourExtension } from 'tdp_core';
import { IPlugin } from 'phovea_core';
export default function ToursTab(): JSX.Element;
export declare function ToursSection(props: {
    level: 'beginner' | 'advanced';
    tours: (IPlugin & ITDPTourExtension)[];
    hrefBase?: string;
}): JSX.Element;
