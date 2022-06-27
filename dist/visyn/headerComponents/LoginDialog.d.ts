import React from 'react';
interface ILoginDialogProps {
    /**
     * Open dialog by default
     */
    show?: boolean;
    /**
     * Title of the dialog
     */
    title?: string;
    /**
     * Adds has-warning css class
     */
    hasWarning?: boolean;
    /**
     * Adds the `has-error` css class
     */
    hasError?: boolean;
    /**
     * Pass login form as child
     */
    children: (onHide: () => void) => React.ReactNode;
}
/**
 * Basic login dialog
 */
export declare function LoginDialog({ show, title, children, hasWarning, hasError, }: ILoginDialogProps): JSX.Element;
export {};
//# sourceMappingURL=LoginDialog.d.ts.map