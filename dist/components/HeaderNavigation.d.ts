/// <reference types="react" />
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
    testId?: string;
}
export declare function HeaderNavigation({ fixed, bg, testId: parentTestId }: IHeaderNavigationProps): JSX.Element;
export {};
