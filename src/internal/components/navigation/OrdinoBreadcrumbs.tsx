import React from 'react';
import { EViewMode } from 'tdp_core';

import { ViewWrapper } from '../../ViewWrapper';

interface IOrdinoBreadcrumbItemProps {
  view: ViewWrapper;

  onClick(view: ViewWrapper): void;

  dataTestId?: string;
}

function OrdinoBreadcrumbItem(props: IOrdinoBreadcrumbItemProps) {
  const historyClassNames = {
    [EViewMode.CONTEXT]: 't-context',
    [EViewMode.HIDDEN]: 't-hide',
    [EViewMode.FOCUS]: 't-focus',
  };

  // TODO Refactor/remove the `useState` and `useEffect` when switching the ViewWrapper to React
  const [viewMode, setViewMode] = React.useState(EViewMode.HIDDEN);
  const [viewName, setViewName] = React.useState(props.view.desc.name);

  // listen to mode changes of the view and update the state accordingly
  React.useEffect(() => {
    const modeChangedListener = (_event, currentMode: EViewMode, _previousMode: EViewMode) => {
      setViewMode(currentMode);
    };

    const replaceViewListener = (_event, view: ViewWrapper) => {
      setViewName(view.desc.name);
    };

    props.view.on(ViewWrapper.EVENT_MODE_CHANGED, modeChangedListener);
    props.view.on(ViewWrapper.EVENT_REPLACE_VIEW, replaceViewListener);

    return () => {
      // cleanup
      props.view.off(ViewWrapper.EVENT_MODE_CHANGED, modeChangedListener);
      props.view.off(ViewWrapper.EVENT_REPLACE_VIEW, replaceViewListener);
    };
  }, [props.view]);

  return (
    <li className={`hview ${historyClassNames[viewMode]}`} data-testid={props.dataTestId}>
      <a
        href="#"
        data-testid={`${props.view.desc.id}-link`}
        onClick={(event) => {
          event.preventDefault();
          props.onClick(props.view);
        }}
      >
        {viewName}
      </a>
    </li>
  );
}

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
    <ul className="tdp-button-group history" aria-label="breadcrumb">
      {props.views.map((view) => {
        return <OrdinoBreadcrumbItem key={view.desc.id} view={view} onClick={props.onClick} />;
      })}
    </ul>
  );
}
