import {EventHandler, ICmdResult, IDType} from 'phovea_core';
import {ViewWrapper} from './ViewWrapper';

export interface IOrdinoApp extends EventHandler {
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
     *
     * @param view
     * @param focus
     */
    removeImpl(view: ViewWrapper, focus: number): Promise<number>;

    /**
     * updates the views information, e.g. history
     */
    update(): void;
  }
