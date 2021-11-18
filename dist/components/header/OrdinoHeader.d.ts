import * as React from 'react';
import { ITab } from './menu/StartMenuTabWrapper';
export interface IOrdinoHeaderProps {
    extensions?: {
        tabs?: ITab[];
        customerLogo?: React.ReactElement | null;
    };
}
export declare function OrdinoHeader({ extensions: { tabs, customerLogo, } }: IOrdinoHeaderProps): JSX.Element;
