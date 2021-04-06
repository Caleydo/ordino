import React from 'react';
import {ListGroup} from 'react-bootstrap';
import {UniqueIdManager} from 'phovea_core';

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
export function OrdinoScrollspy(props: IOrdinoScrollspyProps) {
  // render only the scrollspy container to maintain positions
  if(!props.items || props.items.length === 0) {
    return (
      <div className="ordino-scrollspy-container">
        {props.children}
      </div>
    );
  }

  const suffix = UniqueIdManager.getInstance().uniqueId();

  React.useEffect(() => {
    // refresh scrollspy every time the props.children change or the visibility of this scrollspy has changed
    // (e.g., switching the active tab of the start menu)
    // @see https://getbootstrap.com/docs/4.6/components/scrollspy/#scrollspyrefresh
    $('[data-spy="scroll"]').each(function () {
      // always scroll container to the top before refreshing the scrollspy internals
      // otherwise the scrollspy does not work correctly and wrong navigation items are highlighted.
      this.scrollTo(0, 0);

      $(this).scrollspy('refresh');
    });
  });

  /**
   * Get the href attribute and find the corresponding element with the id.
   * If found scroll the element into the viewport.
   * @param evt Click event
   */
  const scrollIntoView = (evt) => {
    evt.preventDefault(); // prevent jumping to element with id and scroll smoothly instead
    document.querySelector(evt.currentTarget.getAttribute('href'))?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    return false;
  };

  return (
    <>
      <div className="ordino-scrollspy-container" data-spy="scroll" data-target={`#ordino-tab-scrollspy-nav-${suffix}`} data-offset="0">
        {props.children}
      </div>
      <ListGroup variant="flush" id={`ordino-tab-scrollspy-nav-${suffix}`} className="ordino-scrollspy-nav flex-column ml-4">
        {props.items.map((item) => {
          return (
            // Important: We cannot use the react-bootstrap `ListGroup.Item` here, because it sets the `active` class automatically at `onClick`.
            // This behavior cannot be supressed and interfers with the Bootstrap scrollspy + `scrollIntoView` which causes a flickering of the navigation items.
            // The only solution is to use a plain `a` element and add the necessary Bootstrap classes here.
            // <ListGroup.Item key={item.id} action href={`#${item.id}`} onClick={scrollIntoView} className="pl-0 mt-0 border-0 bg-transparent">{item.name}</ListGroup.Item>
            <a key={item.id} href={`#${item.id}`} onClick={scrollIntoView} className="pl-0 mt-0 border-0 bg-transparent list-group-item list-group-item-action">{item.name}</a>
          );
        })}
      </ListGroup>
    </>
  );
}
