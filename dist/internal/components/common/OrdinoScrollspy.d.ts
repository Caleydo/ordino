import React from 'react';
interface IOrdinoScrollspyProps {
    /**
     * List of items for the scrollspy
     */
    items?: {
        /**
         * Jump target. Must be set be set as `id` attribute to child elements
         */
        id: string;
        /**
         * Link text of the navigation item
         */
        name: string;
    }[];
    /**
     * Container content
     */
    children: React.ReactNode;
}
/**
 * The Ordino Scrollspy is a container and adds navigation items.
 * The navigation items are highlighted once they reach the top of the container.
 * Clicking the navigation items scrolls them into the viewport.
 *
 * Important: The jump target must be set as `id` attribute to
 * child elements of the given `props.children`!
 *
 * If no items are given, only the scrollspy container is rendered
 * to maintain positions of the content (i.e., `props.children`).
 *
 * Ordino Scrollspy uses the functionality of the Bootstrap Scrollspy.
 * @see https://getbootstrap.com/docs/4.6/components/scrollspy/
 *
 * @param props IOrdinoScrollspy properties
 */
export declare function OrdinoScrollspy(props: IOrdinoScrollspyProps): JSX.Element;
export {};
