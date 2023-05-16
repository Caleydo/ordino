import React from 'react';
import { ViewWrapper } from '../../ViewWrapper';
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
export declare function OrdinoBreadcrumbs(props: IOrdinoBreadcrumbsProps): React.JSX.Element;
export {};
//# sourceMappingURL=OrdinoBreadcrumbs.d.ts.map