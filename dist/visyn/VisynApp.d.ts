import * as React from 'react';
import { ILoginFormProps } from './headerComponents';
import { IVisynHeaderProps } from './VisynHeader';
export interface IVisynAppComponents {
    Header: React.ComponentType<IVisynHeaderProps>;
    LoginForm: React.ComponentType<ILoginFormProps>;
}
interface IVisynAppProps {
    extensions?: Partial<IVisynAppComponents>;
    watch?: boolean;
    children?: React.ReactNode;
}
export declare function VisynApp({ extensions, children, watch }: IVisynAppProps): JSX.Element;
export {};
//# sourceMappingURL=VisynApp.d.ts.map