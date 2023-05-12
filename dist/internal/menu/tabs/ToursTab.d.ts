import React from 'react';
import { IPlugin } from 'visyn_core/plugin';
import { ITDPTourExtension } from 'tdp_core';
import type { IStartMenuTabProps } from '../../interfaces';
export declare function ToursSection(props: {
    level: 'beginner' | 'advanced';
    tours: (IPlugin & ITDPTourExtension)[];
    hrefBase?: string;
}): React.JSX.Element;
export default function ToursTab(_props: IStartMenuTabProps): React.JSX.Element;
//# sourceMappingURL=ToursTab.d.ts.map