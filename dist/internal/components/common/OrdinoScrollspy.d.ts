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
    children: ((handleOnChange: (id: string, inView: boolean, entry: IntersectionObserverEntry) => void) => React.ReactNode) | React.ReactNode;
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
 * This implementation requires the `InView` component of `react-intersection-observer`.
 * @see https://github.com/thebuilder/react-intersection-observer
 *
 * @example Usage with items to observe
 * ```jsx
 * import {InView} from 'react-intersection-observer';
 * import {OrdinoScrollspy} from 'ordino';
 *
 *  <OrdinoScrollspy items={items.map((item) => ({id: item.desc.id, name: item.desc.name}))}>
 *    {(handleOnChange) =>
 *      {items.map((item) => {
 *        return (
 *          <InView as="div" className="pt-3 pb-5" id={item.desc.id} key={item.desc.id} onChange={(inView: boolean, entry: IntersectionObserverEntry) => handleOnChange(item.desc.id, inView, entry)}>
 *            <h5>${item.desc.name}</h5>
 *            ... other content ...
 *          </InView>
 *        );
 *      })}
 *      </div>
 *    }
 *  </OrdinoScrollspy>
 * ```
 *
 * @example Usage without items to observe
 * ```jsx
 * import {OrdinoScrollspy} from 'ordino';
 *
 *  <OrdinoScrollspy>
 *    <div className="pt-3 pb-5">
 *      <h5>${item.desc.name}</h5>
 *      ... other content ...
 *    </div>
 *  </OrdinoScrollspy>
 * ```
 *
 * @param props IOrdinoScrollspy properties
 */
export declare function OrdinoScrollspy(props: IOrdinoScrollspyProps): JSX.Element;
export {};
