import React from 'react';
import { InView } from 'react-intersection-observer';
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
 * import {OrdinoScrollspy, OrdinoScrollspyItem} from 'ordino';
 *
 *  <OrdinoScrollspy items={items.map((item) => ({id: item.desc.id, name: item.desc.name}))}>
 *    {(handleOnChange) =>
 *      {items.map((item, index) => {
 *        return (
 *          <OrdinoScrollspyItem className="pt-3 pb-5" id={item.desc.id} key={item.desc.id} index={index} onChange={handleOnChange}>
 *            <h5>${item.desc.name}</h5>
 *            ... other content ...
 *          </OrdinoScrollspyItem>
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
export function OrdinoScrollspy(props) {
    // state with all active items
    const [activeItems, setActiveItems] = React.useState({});
    // create ref to avoid rapid state updates and instead updating the state using state using debounce
    const activeItemsRef = React.useRef({});
    React.useEffect(() => {
        // synchronize `activeItemsRef` with `activeItems` (similar to debounce)
        const intervalId = setInterval(() => {
            setActiveItems(activeItemsRef.current);
        }, 100);
        return () => {
            // cleanup
            clearInterval(intervalId);
        };
    }, []);
    /**
     * Get the href attribute and find the corresponding element with the id.
     * If found scroll the element into the viewport.
     * @param event Click event
     */
    const scrollIntoView = React.useCallback((event) => {
        // prevent jumping to element with id and scroll smoothly instead
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.preventDefault();
        event.nativeEvent.stopPropagation();
        document.querySelector(event.currentTarget.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        return false;
    }, []);
    // render only the scrollspy container to maintain positions
    if (typeof props.children !== 'function' || !props.items || props.items.length === 0) {
        // @ts-ignore
        // TODO for holger
        return React.createElement("div", { className: "ordino-scrollspy-container" }, props.children);
    }
    const handleOnChange = (id, index, inView, entry) => {
        // do nothing if item is not set and invisible
        if (!activeItems[id] && inView === false) {
            return;
        }
        activeItemsRef.current = {
            ...activeItemsRef.current,
            // add new item per id if in view
            [id]: inView
                ? {
                    ratio: entry.intersectionRatio,
                    index,
                }
                : null,
        };
    };
    const activeId = Object.entries(activeItems)
        .filter(([_id, item]) => item?.ratio)
        // get items with maximum ratio and on tie use the one with the lowest index
        .sort((a, b) => b[1].ratio - a[1].ratio || a[1].index - b[1].index)?.[0]?.[0]; // pick the first item of the sorted array // get the item's `id` (from Object.entries())
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "ordino-scrollspy-container" }, props.children(handleOnChange)),
        React.createElement("ul", { className: "list-group d-none d-xxxl-block list-group-flush ordino-scrollspy-nav flex-column ms-4" }, props.items.map((item) => {
            return (React.createElement("a", { key: item.id, href: `#${item.id}`, onClick: scrollIntoView, "data-testid": `${item.id}-scrollspy-link`, className: `ps-0 mt-0 border-0 bg-transparent list-group-item list-group-item-action ${item.id === activeId ? 'active' : ''}` }, item.name));
        }))));
}
/**
 * Threshold points when the intersection observer should trigger
 */
const threshold = [0, 1];
/**
 * Wrap the children using the `InView` of `react-intersection-observer`.
 * Extends the `InView` props with custom scrollspy props.
 * @param props
 */
export function OrdinoScrollspyItem({ id, index, handleOnChange, ...innerProps }) {
    return (
    // @ts-expect-error TS2322 Error in `PlainChildrenProps` typings from react-intersection-observer
    React.createElement(InView, { threshold: threshold, id: id, ...innerProps, onChange: (inView, entry) => {
            if (innerProps.onChange) {
                innerProps.onChange(inView, entry);
            }
            handleOnChange(id, index, inView, entry);
        } }));
}
//# sourceMappingURL=OrdinoScrollspy.js.map