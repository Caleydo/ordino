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
}
export declare function HeaderNavigation(props: IHeaderNavigationProps): JSX.Element;
export {};
