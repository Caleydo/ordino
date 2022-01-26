/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { ActionNode, IAction, ICmdResult, IObjectRef, ProvenanceGraph } from 'tdp_core';
import { IDType } from 'tdp_core';
import { ViewWrapper } from './ViewWrapper';
import { ISelection } from 'tdp_core';
import { IOrdinoApp } from './IOrdinoApp';
export declare class CmdUtils {
    static asSelection(data: ReturnType<(typeof CmdUtils)['serializeSelection']>): ISelection;
    static serializeSelection(selection?: ISelection): {
        idtype: string;
        selection: string[];
    };
    /**
     * Creates a view instance and wraps the instance with the inverse action in a CLUE command
     * @param inputs Array with object references, where the first one is the OrdinoApp object
     * @param parameter Parameter such idtype, selection and view options
     * @param graph The Provenance graph
     * @returns {Promise<ICmdResult>}
     */
    static createViewImpl(this: ActionNode, inputs: IObjectRef<any>[], parameter: any, graph: ProvenanceGraph): Promise<ICmdResult>;
    /**
     * Removes a view instance and wraps the instance with the inverse action in a CLUE command
     * @param inputs Array with object references, where the first one is the OrdinoApp object
     * @param parameter Parameter such idtype, selection and view options
     * @returns {ICmdResult}
     */
    static removeViewImpl(inputs: IObjectRef<any>[], parameter: any): ICmdResult;
    /**
     * Replaces a (inner) view of an existing ViewWrapper with a new (inner) view.
     * First backup the data of the existing view, delete it and then create a new view.
     * The inverse provenance graph action will restore the old view.
     *
     * @param inputs Array with object references, where the first one is the OrdinoApp object
     * @param parameter Parameter such idtype, selection and view options
     * @returns {Promise<ICmdResult>}
     */
    static replaceViewImpl(this: ActionNode, inputs: IObjectRef<any>[], parameter: any): Promise<ICmdResult>;
    /**
     * Creates a view and adds a CLUE command view to the provenance graph
     * @param app
     * @param viewId
     * @param idtype
     * @param selection
     * @param options
     * @returns {IAction}
     */
    static createView<T extends IOrdinoApp>(app: IObjectRef<T>, viewId: string, idtype: IDType, selection: string[], options?: any, itemSelection?: ISelection): IAction;
    /**
     * Removes a view and adds a CLUE command view to the provenance graph
     * @param app
     * @param view ViewWrapper instance of the view
     * @param oldFocus
     * @returns {IAction}
     */
    static removeView<T extends IOrdinoApp>(app: IObjectRef<T>, view: IObjectRef<ViewWrapper>, oldFocus?: number): IAction;
    /**
     * Replaces an (inner) view of an existing ViewWrapper and adds a CLUE command view to the provenance graph
     * @param app
     * @param existingView
     * @param viewId
     * @param idtype
     * @param selection
     * @param options
     * @returns {IAction}
     */
    static replaceView<T extends IOrdinoApp>(app: IObjectRef<T>, existingView: IObjectRef<ViewWrapper>, viewId: string, idtype: IDType, selection: string[], options?: any, itemSelection?: ISelection): IAction;
    static setSelectionImpl(inputs: IObjectRef<any>[], parameter: any): any;
    static setSelection(view: IObjectRef<ViewWrapper>, idtype: IDType, selection: string[]): any;
    static setAndUpdateSelection(view: IObjectRef<ViewWrapper>, target: IObjectRef<ViewWrapper>, idtype: IDType, selection: string[]): IAction;
    /**
     * Factory function that compresses a series of action to fewer one.
     * Note: This function is referenced as `actionCompressor` in the package.json
     * @type {string}
     * @param path
     * @returns {Array}
     */
    static compressCreateRemove(path: ActionNode[]): ActionNode[];
    static compressSetSelection(path: ActionNode[]): ActionNode[];
}
