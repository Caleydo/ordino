import { ComponentType } from 'react';
import { IVisynLoginFormProps } from './headerComponents';
export interface ILoginLinkProps {
    userName?: string;
    onLogout: () => Promise<void>;
}
export declare function VisynLoginLink({ userName, onLogout }: ILoginLinkProps): JSX.Element;
export interface ILoginMenuProps {
    watch?: boolean;
    extensions?: {
        LoginForm?: ComponentType<IVisynLoginFormProps>;
    };
}
export declare function VisynLoginMenu({ watch, extensions }: ILoginMenuProps): JSX.Element;
//# sourceMappingURL=LoginMenu.d.ts.map