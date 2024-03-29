import * as React from 'react';
interface IHeaderNavigationProps {
    /**
     * Defines if the header is sticky and visible when scrolling the page down
     */
    fixed?: 'top' | 'bottom';
    /**
     * Background color
     * @default dark (see variables.scss)
     */
    bg?: string;
}
export declare function HeaderNavigation({ fixed, bg }: IHeaderNavigationProps): React.JSX.Element;
export {};
//# sourceMappingURL=HeaderNavigation.d.ts.map