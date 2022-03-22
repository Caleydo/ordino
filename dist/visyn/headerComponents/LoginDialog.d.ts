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
     * Pass login form as child
     */
    children: (onHide: () => void) => React.ReactNode;
}
/**
 * Basic login dialog
 */
export declare function LoginDialog({ show, title, children }: ILoginDialogProps): JSX.Element;
export {};
//# sourceMappingURL=LoginDialog.d.ts.map