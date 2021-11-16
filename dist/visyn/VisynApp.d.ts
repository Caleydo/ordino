import * as React from 'react';
interface IVisynAppProps {
    extensions?: {
        header?: React.ReactElement;
    };
    children?: React.ReactNode;
}
export declare function VisynApp({ extensions: { header }, children }: IVisynAppProps): JSX.Element;
export {};
