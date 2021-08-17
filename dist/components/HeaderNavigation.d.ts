/// <reference types="react" />
interface IHeaderNavigationLink {
    text: string;
    page: string;
}
interface IHeaderNavigationProps {
    /**
     * Specify the links of the header
     * @default []
     */
    links?: IHeaderNavigationLink[];
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
export declare function HeaderNavigation({ links, fixed, bg }: IHeaderNavigationProps): JSX.Element;
export {};
