import { ViewWrapper } from './ViewWrapper';
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
    pushImpl(view: ViewWrapper): Promise<number>;
    /**
     * Remove the given and focus on the view with the given index.
     * If the focus index is -1 the previous view of the given view will be focused.
     *
     * @param view View instance to remove
     * @param focus Index of the view in the view list (default: -1)
     */
    removeImpl(view: ViewWrapper, focus: number): Promise<number>;
}
