import React from 'react';
import { EViewMode } from 'tdp_core';
import { ViewWrapper } from '../../ViewWrapper';
function OrdinoBreadcrumbItem(props) {
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
        const modeChangedListener = (_event, currentMode, _previousMode) => {
            setViewMode(currentMode);
        };
        const replaceViewListener = (_event, view) => {
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
    return (React.createElement("li", { className: `hview ${historyClassNames[viewMode]}` },
        React.createElement("a", { href: "#", onClick: (event) => {
                event.preventDefault();
                props.onClick(props.view);
            } }, viewName)));
}
/**
 * Ordino breadcrumb navigation highlighting the focus and context view.
 * Calls `onClick` callback when a breadcrumb item is clicked.
 * @param props properties
 */
export function OrdinoBreadcrumbs(props) {
    return (React.createElement("ul", { className: "tdp-button-group history", "aria-label": "breadcrumb" }, props.views.map((view) => {
        return React.createElement(OrdinoBreadcrumbItem, { key: view.desc.id, view: view, onClick: props.onClick });
    })));
}
//# sourceMappingURL=OrdinoBreadcrumbs.js.map