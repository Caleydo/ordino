/// <reference types="react" />
import { IPlugin } from 'visyn_core';
import { ITDPTourExtension } from 'tdp_core';
import type { IStartMenuTabProps } from '../../interfaces';
export declare function ToursSection(props: {
    level: 'beginner' | 'advanced';
    tours: (IPlugin & ITDPTourExtension)[];
    hrefBase?: string;
}): JSX.Element;
export default function ToursTab(_props: IStartMenuTabProps): JSX.Element;
//# sourceMappingURL=ToursTab.d.ts.map