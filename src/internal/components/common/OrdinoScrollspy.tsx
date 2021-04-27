import React from 'react';
import {ListGroup} from 'react-bootstrap';
import {debounce} from 'lodash';

interface IOrdinoScrollspyProps {
  /**
   * List of items for the scrollspy
   */
  items?: {
    /**
     * Jump target. Must be set be set as `id` attribute to child elements
     */
    id: string,
    /**
     * Link text of the navigation item
     */
    name: string
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
export function OrdinoScrollspy(props: IOrdinoScrollspyProps) {
  // render only the scrollspy container to maintain positions
  if(typeof(props.children) !== 'function' || !props.items || props.items.length === 0) {
    return (
      <div className="ordino-scrollspy-container">
        {props.children}
      </div>
    );
  }

  const [activeItemIndex, setActiveItemIndex] = React.useState(0); // highlight first item by default

  const handleOnChange = (id: string, inView: boolean, entry: IntersectionObserverEntry) => {
    const currentItemIndex = props.items.findIndex((item) => item.id === id);

    if(currentItemIndex === activeItemIndex && inView === false) {
      setActiveItemIndex(currentItemIndex + 1); // highlight next item once the active one is invisble

    } else if(currentItemIndex < activeItemIndex && inView === true) {
      setActiveItemIndex(currentItemIndex); // highlight previous item once it is visible
    }
  };

  const containerRef = React.useRef(null);

  // check scroll position of container to highlight last item once the scroll bar reaches the bottom
  React.useEffect(() => {
    let scrolledToBottom = false;

    // TODO the container height must be initialized after showing the scroll spy. otherwise the height is 0.
    let containerHeight = containerRef.current.getBoundingClientRect().height;
    // console.log('set containerHeight', containerHeight);

    // update the container height when resizing the window
    const resizeListener = debounce(() => {
      containerHeight = containerRef.current.getBoundingClientRect().height;
    }, 250); // debounce avoid performance issues by calling `getBoundingClientRect()`

    window.addEventListener('resize', resizeListener);

    const scrollListener = (event) => {
      const element = event.target;
      // console.log(element.scrollHeight, element.scrollTop, containerHeight, element.scrollHeight - element.scrollTop === containerHeight, scrolledToBottom);

      // check if container is scrolled to the bottom
      if (element.scrollHeight - element.scrollTop === containerHeight) {
        scrolledToBottom = true;
        setActiveItemIndex(props.items.length - 1); // highlight last item of the list

      // check if container was already scrolled to bottom and now scrolled up again
      } else if(scrolledToBottom) {
        scrolledToBottom = false;
        setActiveItemIndex(props.items.length - 2); // highlight item previous to the last one
        // FIXME there are still edge cases depending on the container and window height
      }
    };

    containerRef.current.addEventListener('scroll', scrollListener);

    return () => { // cleanup = remove event listener
      window.removeEventListener('resize', resizeListener);
      containerRef.current.removeEventListener('scroll', scrollListener);
    };
  }, []);

  /**
   * Get the href attribute and find the corresponding element with the id.
   * If found scroll the element into the viewport.
   * @param event Click event
   */
  const scrollIntoView = (event) => {
    event.preventDefault(); // prevent jumping to element with id and scroll smoothly instead
    document.querySelector(event.currentTarget.getAttribute('href'))?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    return false;
  };

  return (
    <>
      <div ref={containerRef} className="ordino-scrollspy-container">
        {props.children(handleOnChange)}
      </div>
      <ListGroup variant="flush" className="ordino-scrollspy-nav flex-column ml-4">
        {props.items.map((item, index) => {
          return (
            <ListGroup.Item key={item.id} action href={`#${item.id}`} onClick={scrollIntoView} className={`pl-0 mt-0 border-0 bg-transparent ${index === activeItemIndex ? 'active' : ''}`}>{item.name}</ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
}
