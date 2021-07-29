/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/
import { ActionNode, IObjectRef, ProvenanceGraph } from 'phovea_core';
import { ViewWrapper } from './ViewWrapper';
import { ISelection } from 'tdp_core';
export declare class CmdUtils {
    static asSelection(data: {
        idtype: string;
        selection: string;
    }): ISelection;
    static serializeSelection(selection?: ISelection): {
        idtype: string;
        selection: string;
    };
    static createViewTrrack(graph: ProvenanceGraph, inputs: IObjectRef<any>[], parameter: any, previousSelection: any | null, firstRun?: boolean): Promise<ViewWrapper>;
    static removeViewTrrack(inputs: IObjectRef<any>[]): void;
    /**
     * Replaces a (inner) view of an existing ViewWrapper with a new (inner) view.
     * First backup the data of the existing view, delete it and then create a new view.
     * The inverse provenance graph action will restore the old view.
     *
     * @param inputs Array with object references, where the first one is the OrdinoApp object
     * @param parameter Parameter such idtype, selection and view options
     * @returns {Promise<ICmdResult>}
     */
    static replaceViewTrrack(inputs: IObjectRef<any>[], parameter: any, previousSelection: any | null): Promise<void>;
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
    static setSelectionTrrack(inputs: IObjectRef<any>[], parameter: any): Promise<void>;
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
