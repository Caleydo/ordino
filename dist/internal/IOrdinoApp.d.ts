import { ViewWrapper } from 'tdp_core';
export interface IOrdinoApp {
    /**
     * Root HTML node of the Ordino App
     */
    readonly node: Element;
    /**
     * List of all view wrappers / views that are currently open
     */
    readonly views: ViewWrapper[];
    /**
     * The last view of the list of open views
     */
    readonly lastView: ViewWrapper;
    /**
     * Add a new view wrapper to the list of open views.
     * The return value is index in the list of views.
     * @param view ViewWrapper
     */
    pushImpl(view: ViewWrapper): any;
    replaceImpl(previous: ViewWrapper, next: ViewWrapper): any;
    /**
     * Remove the given and focus on the view with the given index.
     * If the focus index is -1 the previous view of the given view will be focused.
     *
     * @param view View instance to remove
     * @param focus Index of the view in the view list (default: -1)
     */
    removeImpl(view: ViewWrapper, focus: number): Promise<number>;
    /**
     * Starts a new analysis session with a given view and additional options.
     * The default session values are permanently stored in the provenance graph and the session storage.
     *
     * All provided parameters are persisted to the session storage.
     * Then a new analysis session (provenance graph) is created by reloading the page.
     * After the page load a new session is available and new actions for the initial view
     * are pushed to the provenance graph (see `initNewSession()`).
     *
     * @param startViewId First view of the analysis session
     * @param startViewOptions Options that are passed to the initial view (e.g. a NamedSet)
     * @param defaultSessionValues Values that are stored in the provenance graph and the session storage
     */
    startNewSession(startViewId: string, startViewOptions: any, defaultSessionValues: any): any;
}
