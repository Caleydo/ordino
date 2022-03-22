import { ComponentType } from 'react';
import { ILoginFormProps } from './headerComponents';
export interface ILoginLinkProps {
    userName?: string;
    onLogout: () => Promise<void>;
}
export declare function LoginLink({ userName, onLogout }: ILoginLinkProps): JSX.Element;
export interface ILoginMenuProps {
    onLogout: () => Promise<any>;
    watch?: boolean;
    extensions?: {
        LoginForm?: ComponentType<ILoginFormProps>;
    };
}
export declare function LoginMenu({ onLogout, watch, extensions }: ILoginMenuProps): JSX.Element;
//# sourceMappingURL=LoginMenu.d.ts.map