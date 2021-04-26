import React from 'react';
import {ViewWrapper} from '../../ViewWrapper';
import {EViewMode} from 'tdp_core';

interface IOrdinoBreadcrumbsProps {
  /**
   * List of open views
   */
  views: ViewWrapper[];

  /**
   * The callback is called when the breadcrumb item is clicked.
   * @param view Instance of the view wrapper that was selected
   */
  onClick(view: ViewWrapper): void;
}

/**
 * Ordino breadcrumb navigation highlighting the focus and context view.
 * Calls `onClick` callback when a breadcrumb item is clicked.
 * @param props properties
 */
export function OrdinoBreadcrumbs(props: IOrdinoBreadcrumbsProps) {
  return (
    <ul className="tdp-button-group history">
      {props.views.map((view) => {
        return (
          <OrdinoBreadcrumbItem key={view.desc.id} view={view} onClick={props.onClick}></OrdinoBreadcrumbItem>
        );
      })}
    </ul>
  );
}


interface OrdinoBreadcrumbItemProps {
  view: ViewWrapper;

  onClick(view: ViewWrapper): void;
}

function OrdinoBreadcrumbItem(props: OrdinoBreadcrumbItemProps) {
  const historyClassNames = {
    [EViewMode.CONTEXT]: 't-context',
    [EViewMode.HIDDEN]: 't-hide',
    [EViewMode.FOCUS]: 't-focus'
  };

  // TODO Refactor/remove the `useState` and `useEffect` when switching the ViewWrapper to React
  const [viewMode, setViewMode] = React.useState(EViewMode.HIDDEN);

  // listen to mode changes of the view and update the state accordingly
  React.useEffect(() => {
    const listener = (_event, currentMode: EViewMode, _previousMode: EViewMode) => {
      setViewMode(currentMode);
    };

    props.view.on(ViewWrapper.EVENT_MODE_CHANGED, listener);

    return () => { // cleanup
      props.view.off(ViewWrapper.EVENT_MODE_CHANGED, listener)
    }
  }, [props.view]);

  return (
    <li className={`hview ${historyClassNames[viewMode]}`}>
      <a href="#" onClick={(event) => {
        event.preventDefault();
        props.onClick(props.view);
      }}>{props.view.desc.name}</a>
    </li>
  );
}
