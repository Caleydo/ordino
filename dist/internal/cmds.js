/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */
import { ActionUtils, ActionMetaData, ObjectRefUtils, PluginRegistry, IDTypeManager, EXTENSION_POINT_TDP_VIEW, } from 'tdp_core';
import { ViewWrapper } from './ViewWrapper';
const CMD_CREATE_VIEW = 'targidCreateView';
const CMD_REMOVE_VIEW = 'targidRemoveView';
const CMD_REPLACE_VIEW = 'targidReplaceView';
const CMD_SET_SELECTION = 'targidSetSelection';
export class CmdUtils {
    static asSelection(data) {
        return {
            ids: data.selection || [],
            idtype: data.idtype ? IDTypeManager.getInstance().resolveIdType(data.idtype) : null,
        };
    }
    static serializeSelection(selection) {
        if (!selection || !selection.idtype || !selection.ids || selection.ids.length === 0) {
            return null;
        }
        return { idtype: selection.idtype.id, selection: selection.ids };
    }
    /**
     * Creates a view instance and wraps the instance with the inverse action in a CLUE command
     * @param inputs Array with object references, where the first one is the OrdinoApp object
     * @param parameter Parameter such idtype, selection and view options
     * @param graph The Provenance graph
     * @returns {Promise<ICmdResult>}
     */
    static async createViewImpl(inputs, parameter, graph) {
        const app = inputs[0].value;
        const { viewId } = parameter;
        const selection = CmdUtils.asSelection(parameter);
        const itemSelection = parameter.itemSelection ? CmdUtils.asSelection(parameter.itemSelection) : null;
        const options = { ...parameter.options, app }; // pass the app in options (e.g., to access the list of open views)
        const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
        const viewWrapperInstance = await ViewWrapper.createViewWrapper(graph, selection, itemSelection, app.node, view, !this.onceExecuted, options);
        if (viewWrapperInstance.built) {
            await viewWrapperInstance.built;
        }
        const oldFocus = await app.pushImpl(viewWrapperInstance);
        return {
            created: [viewWrapperInstance.ref],
            inverse: (i, created, removed) => CmdUtils.removeView(i[0], created[0], oldFocus),
        };
    }
    /**
     * Removes a view instance and wraps the instance with the inverse action in a CLUE command
     * @param inputs Array with object references, where the first one is the OrdinoApp object
     * @param parameter Parameter such idtype, selection and view options
     * @returns {ICmdResult}
     */
    static removeViewImpl(inputs, parameter) {
        const app = inputs[0].value;
        const existingView = inputs[1].value;
        const oldFocus = parameter.focus;
        const existingViewOptions = { ...existingView.options }; // clone options to avoid mutation of the original object
        delete existingViewOptions.app; // remove Ordino app from options to avoid circular referencenc on JSON stringify in the provenance graph
        app.removeImpl(existingView, oldFocus);
        return {
            removed: [inputs[1]],
            inverse: CmdUtils.createView(inputs[0], existingView.desc.id, existingView.selection.idtype, existingView.selection.ids, existingViewOptions, existingView.getItemSelection()),
        };
    }
    /**
     * Replaces a (inner) view of an existing ViewWrapper with a new (inner) view.
     * First backup the data of the existing view, delete it and then create a new view.
     * The inverse provenance graph action will restore the old view.
     *
     * @param inputs Array with object references, where the first one is the OrdinoApp object
     * @param parameter Parameter such idtype, selection and view options
     * @returns {Promise<ICmdResult>}
     */
    static async replaceViewImpl(inputs, parameter) {
        const app = inputs[0].value;
        const existingView = inputs[1].value;
        const existingViewOptions = { ...existingView.options }; // clone options to avoid mutation of the original object
        delete existingViewOptions.app; // remove Ordino app from options to avoid circular referencenc on JSON stringify in the provenance graph
        const oldParams = {
            viewId: existingView.desc.id,
            idtype: existingView.selection.idtype,
            selection: existingView.selection.ids,
            itemSelection: existingView.getItemSelection(),
            options: existingViewOptions,
        };
        const { viewId } = parameter;
        const selection = CmdUtils.asSelection(parameter);
        const itemSelection = parameter.itemSelection ? CmdUtils.asSelection(parameter.itemSelection) : null;
        const options = { ...parameter.options, app }; // pass the app in options (e.g., to access the list of open views)
        // create new (inner) view
        const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
        await ViewWrapper.replaceViewWrapper(existingView, selection, itemSelection, view, !this.onceExecuted, options);
        return {
            inverse: CmdUtils.replaceView(inputs[0], inputs[1], oldParams.viewId, oldParams.idtype, oldParams.selection, oldParams.options, oldParams.itemSelection),
        };
    }
    /**
     * Creates a view and adds a CLUE command view to the provenance graph
     * @param app
     * @param viewId
     * @param idtype
     * @param selection
     * @param options
     * @returns {IAction}
     */
    static createView(app, viewId, idtype, selection, options, itemSelection) {
        const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
        // assert view
        return ActionUtils.action(ActionMetaData.actionMeta(`Add ${view.name}`, ObjectRefUtils.category.visual, ObjectRefUtils.operation.create), CMD_CREATE_VIEW, CmdUtils.createViewImpl, [app], {
            viewId,
            idtype: idtype ? idtype.id : null,
            selection: selection || [],
            itemSelection: CmdUtils.serializeSelection(itemSelection),
            options,
        });
    }
    /**
     * Removes a view and adds a CLUE command view to the provenance graph
     * @param app
     * @param view ViewWrapper instance of the view
     * @param oldFocus
     * @returns {IAction}
     */
    static removeView(app, view, oldFocus = -1) {
        // assert view
        return ActionUtils.action(ActionMetaData.actionMeta(`Remove ${view.toString()}`, ObjectRefUtils.category.visual, ObjectRefUtils.operation.remove), CMD_REMOVE_VIEW, CmdUtils.removeViewImpl, [app, view], {
            viewId: view.value.desc.id,
            focus: oldFocus,
        });
    }
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
    static replaceView(app, existingView, viewId, idtype, selection, options, itemSelection) {
        const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
        // assert view
        return ActionUtils.action(ActionMetaData.actionMeta(`Replace ${existingView.name} with ${view.name}`, ObjectRefUtils.category.visual, ObjectRefUtils.operation.update), CMD_REPLACE_VIEW, CmdUtils.replaceViewImpl, [app, existingView], {
            viewId,
            idtype: idtype ? idtype.id : null,
            selection: selection || [],
            itemSelection: CmdUtils.serializeSelection(itemSelection),
            options,
        });
    }
    static async setSelectionImpl(inputs, parameter) {
        const views = await Promise.all([inputs[0].v, inputs.length > 1 ? inputs[1].v : null]);
        const view = views[0];
        const target = views[1];
        const idtype = parameter.idtype ? IDTypeManager.getInstance().resolveIdType(parameter.idtype) : null;
        const ids = parameter.ids || [];
        const bak = view.getItemSelection();
        await Promise.resolve(view.setItemSelection({ idtype, ids }));
        if (target) {
            await Promise.resolve(target.setParameterSelection({ idtype, ids }));
        }
        return {
            inverse: inputs.length > 1 ? CmdUtils.setAndUpdateSelection(inputs[0], inputs[1], bak.idtype, bak.ids) : CmdUtils.setSelection(inputs[0], bak.idtype, bak.ids),
        };
    }
    static setSelection(view, idtype, ids) {
        // assert view
        return ActionUtils.action(ActionMetaData.actionMeta(`Select ${idtype ? idtype.name : 'None'}`, ObjectRefUtils.category.selection, ObjectRefUtils.operation.update), CMD_SET_SELECTION, CmdUtils.setSelectionImpl, [view], {
            idtype: idtype ? idtype.id : null,
            ids,
        });
    }
    static setAndUpdateSelection(view, target, idtype, ids) {
        // assert view
        return ActionUtils.action(ActionMetaData.actionMeta(`Select ${idtype ? idtype.name : 'None'}`, ObjectRefUtils.category.selection, ObjectRefUtils.operation.update), CMD_SET_SELECTION, CmdUtils.setSelectionImpl, [view, target], {
            idtype: idtype ? idtype.id : null,
            ids,
        });
    }
    /**
     * Factory function that compresses a series of action to fewer one.
     * Note: This function is referenced as `actionCompressor` in the package.json
     * @type {string}
     * @param path
     * @returns {Array}
     */
    static compressCreateRemove(path) {
        const r = [];
        function compatibilityReplaceView(previous) {
            // old replace view creates a new ref for each new view instead of reusing the old one
            if (previous.f_id !== CMD_REPLACE_VIEW) {
                return false;
            }
            // in case of the view created an ref (=old behavior) -> keep it
            return previous.creates.length > 0;
        }
        // eslint-disable-next-line no-labels
        outer: for (const act of path) {
            if (act.f_id === CMD_REMOVE_VIEW) {
                const removed = act.removes[0];
                // removed view delete intermediate change and optional creation
                for (let j = r.length - 1; j >= 0; --j) {
                    // back to forth for better removal
                    const previous = r[j];
                    const { requires } = previous;
                    const usesView = requires.indexOf(removed) >= 0;
                    if (usesView && !compatibilityReplaceView(previous)) {
                        r.splice(j, 1);
                    }
                    else if (previous.f_id === CMD_CREATE_VIEW && previous.creates[0] === removed) {
                        // found adding remove both
                        r.splice(j, 1);
                        // eslint-disable-next-line no-labels
                        continue outer;
                    }
                }
            }
            if (act.f_id === CMD_REPLACE_VIEW) {
                const view = act.requires[1];
                // changed the view in place can remove all previous set parameter/selection calls till the creation
                for (let j = r.length - 1; j >= 0; --j) {
                    // back to forth for better removal
                    const previous = r[j];
                    const { requires } = previous;
                    const usesView = requires.indexOf(view) >= 0;
                    // uses view (setParameter, replace, ...) but not its creation
                    if (usesView && previous.f_id !== CMD_CREATE_VIEW) {
                        r.splice(j, 1);
                    }
                }
            }
            r.push(act);
        }
        return r;
    }
    static compressSetSelection(path) {
        // The compression of selection is incorrect, as the graph relies on a valid "undo" action to be passed.
        // This undo-action gets the selection from the currently active view, which DOES NOT always have to be the previous node,
        // but could be a few nodes before that. Imagine 3 selections, you are in state 1 and jump to state 3. The previous will
        // be the selection from state 1, which IS NOT the previous of state 3, as that would be state 2. When you now jump to state 2,
        // it undos the action, such that the selection is restored from state 1, but you are now in state 2.
        // return Compression.lastConsecutive(path, CMD_SET_SELECTION, (p: ActionNode) => `${p.parameter.idtype}@${p.requires[0].id}`);
        return path;
    }
}
//# sourceMappingURL=cmds.js.map