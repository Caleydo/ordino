import * as React from 'react';
import { ViewWrapper } from '.';
interface IExternalViewPortalProps {
    viewWrapper: ViewWrapper;
    /**
     * Whether or not the children should be rendered in an external window.
     */
    active: boolean;
    /**
     * Getter for custom window objects.
     * Custom window objects can be useful as certain browsers block window.open calls which are
     * not the direct result of certain events such as click. Therefore, you can create your own
     * window object in an onClick and then return it from this callback.
     */
    getWindow?(): Window | null;
    /**
     * Children to be rendered.
     */
    children: React.ReactNode;
    /**
     * Title of the opened window.
     */
    title?: string;
    /**
     * Callback when the window is opened.
     * @param window Window that was opened.
     */
    onWindowOpened?(window: Window): void;
    /**
     * Callback when the window is closed.
     */
    onWindowClosed?(): void;
    /**
     * Whether the window should be opened as tab instead of a new window.
     */
    asTab?: boolean;
    /**
     * Width of the opened window.
     */
    width?: number;
    /**
     * Height of the opened window.
     */
    height?: number;
    /**
     * Top position of the opened window.
     */
    top?: number;
    /**
     * Left position of the opened window.
     */
    left?: number;
}
/**
 * Renders all children in a newly opened external window.
 */
export declare const ExternalViewPortal: (props: IExternalViewPortalProps) => any;
export {};
