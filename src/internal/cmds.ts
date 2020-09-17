/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/


import {
  ActionUtils,
  ActionNode,
  ActionMetaData,
  IAction,
  ObjectRefUtils,
  ICmdResult,
  IObjectRef,
  ProvenanceGraph
} from 'phovea_core';
import {PluginRegistry} from 'phovea_core';
import {Range, ParseRangeUtils} from 'phovea_core';
import {IDTypeManager, IDType} from 'phovea_core';
import {ViewWrapper} from './ViewWrapper';
import {EXTENSION_POINT_TDP_VIEW, ISelection} from 'tdp_core';
import {Compression} from 'phovea_clue';
import { IOrdinoApp } from './IOrdinoApp';


const CMD_CREATE_VIEW = 'targidCreateView';
const CMD_REMOVE_VIEW = 'targidRemoveView';
const CMD_REPLACE_VIEW = 'targidReplaceView';
const CMD_SET_SELECTION = 'targidSetSelection';

export class CmdUtils {

  static asSelection(data: {idtype: string, selection: string}): ISelection {
    return {
      range: data.selection ? ParseRangeUtils.parseRangeLike(data.selection) : Range.none(),
      idtype: data.idtype ? IDTypeManager.getInstance().resolveIdType(data.idtype) : null
    };
  }

  static serializeSelection(selection?: ISelection) {
    if (!selection || !selection.idtype || !selection.range || selection.range.isNone) {
      return null;
    }
    return { idtype: selection.idtype.id, selection: selection.range.toString() };
  }

  /**
   * Creates a view instance and wraps the instance with the inverse action in a CLUE command
   * @param inputs Array with object references, where the first one is the OrdinoApp object
   * @param parameter Parameter such idtype, selection and view options
   * @param graph The Provenance graph
   * @returns {Promise<ICmdResult>}
   */
  static async createViewImpl(this: ActionNode, inputs: IObjectRef<any>[], parameter: any, graph: ProvenanceGraph): Promise<ICmdResult> {
    const app: IOrdinoApp = inputs[0].value;
    const viewId: string = parameter.viewId;
    const selection = CmdUtils.asSelection(parameter);
    const itemSelection = parameter.itemSelection ? CmdUtils.asSelection(parameter.itemSelection) : null;
    const options: any & { app: IOrdinoApp } = {...parameter.options, app}; // pass the app in options (e.g., to access the list of open views)

    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);

    const viewWrapperInstance = await ViewWrapper.createViewWrapper(graph, selection, itemSelection, app.node, view, !this.onceExecuted, options);
    if (viewWrapperInstance.built) {
      await viewWrapperInstance.built;
    }
    const oldFocus = await app.pushImpl(viewWrapperInstance);
    return {
      created: [viewWrapperInstance.ref],
      inverse: (inputs, created, removed) => CmdUtils.removeView(inputs[0], created[0], oldFocus)
    };
  }

  /**
   * Removes a view instance and wraps the instance with the inverse action in a CLUE command
   * @param inputs Array with object references, where the first one is the OrdinoApp object
   * @param parameter Parameter such idtype, selection and view options
   * @returns {ICmdResult}
   */
  static removeViewImpl(inputs: IObjectRef<any>[], parameter): ICmdResult {
    const app: IOrdinoApp = inputs[0].value;
    const existingView: ViewWrapper = inputs[1].value;
    const oldFocus: number = parameter.focus;

    const existingViewOptions = {...existingView.options}; // clone options to avoid mutation of the original object
    delete existingViewOptions.app; // remove Ordino app from options to avoid circular referencenc on JSON stringify in the provenance graph

    app.removeImpl(existingView, oldFocus);
    return {
      removed: [inputs[1]],
      inverse: CmdUtils.createView(inputs[0], existingView.desc.id, existingView.selection.idtype, existingView.selection.range, existingViewOptions, existingView.getItemSelection())
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
  static async replaceViewImpl(this: ActionNode, inputs: IObjectRef<any>[], parameter: any): Promise<ICmdResult> {
    const app: IOrdinoApp = inputs[0].value;
    const existingView: ViewWrapper = inputs[1].value;

    const existingViewOptions = {...existingView.options}; // clone options to avoid mutation of the original object
    delete existingViewOptions.app; // remove Ordino app from options to avoid circular referencenc on JSON stringify in the provenance graph

    const oldParams = {
      viewId: existingView.desc.id,
      idtype: existingView.selection.idtype,
      selection: existingView.selection.range,
      itemSelection: existingView.getItemSelection(),
      options: existingViewOptions
    };

    const viewId: string = parameter.viewId;
    const selection = CmdUtils.asSelection(parameter);
    const itemSelection = parameter.itemSelection ? CmdUtils.asSelection(parameter.itemSelection) : null;
    const options: any & { app: IOrdinoApp } = {...parameter.options, app}; // pass the app in options (e.g., to access the list of open views)

    // create new (inner) view
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);

    await ViewWrapper.replaceViewWrapper(existingView, selection, itemSelection, view, !this.onceExecuted, options);

    app.update();

    return {
      inverse: CmdUtils.replaceView(inputs[0], inputs[1], oldParams.viewId, oldParams.idtype, oldParams.selection, oldParams.options, oldParams.itemSelection)
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
  static createView<T extends IOrdinoApp>(app: IObjectRef<T>, viewId: string, idtype: IDType, selection: Range, options?, itemSelection?: ISelection): IAction {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
    // assert view
    return ActionUtils.action(ActionMetaData.actionMeta('Add ' + view.name, ObjectRefUtils.category.visual, ObjectRefUtils.operation.create), CMD_CREATE_VIEW, CmdUtils.createViewImpl, [app], {
      viewId,
      idtype: idtype ? idtype.id : null,
      selection: selection ? selection.toString() : Range.none().toString(),
      itemSelection: CmdUtils.serializeSelection(itemSelection),
      options
    });
  }

  /**
   * Removes a view and adds a CLUE command view to the provenance graph
   * @param app
   * @param view ViewWrapper instance of the view
   * @param oldFocus
   * @returns {IAction}
   */
  static removeView<T extends IOrdinoApp>(app: IObjectRef<T>, view: IObjectRef<ViewWrapper>, oldFocus = -1): IAction {
    // assert view
    return ActionUtils.action(ActionMetaData.actionMeta('Remove ' + view.toString(), ObjectRefUtils.category.visual, ObjectRefUtils.operation.remove), CMD_REMOVE_VIEW, CmdUtils.removeViewImpl, [app, view], {
      viewId: view.value.desc.id,
      focus: oldFocus
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
  static replaceView<T extends IOrdinoApp>(app: IObjectRef<T>, existingView: IObjectRef<ViewWrapper>, viewId: string, idtype: IDType, selection: Range, options?, itemSelection?: ISelection): IAction {
    const view = PluginRegistry.getInstance().getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
    // assert view
    return ActionUtils.action(ActionMetaData.actionMeta('Replace ' + existingView.name + ' with ' + view.name, ObjectRefUtils.category.visual, ObjectRefUtils.operation.update), CMD_REPLACE_VIEW, CmdUtils.replaceViewImpl, [app, existingView], {
      viewId,
      idtype: idtype ? idtype.id : null,
      selection: selection ? selection.toString() : Range.none().toString(),
      itemSelection: CmdUtils.serializeSelection(itemSelection),
      options
    });
  }

  static async setSelectionImpl(inputs: IObjectRef<any>[], parameter) {
    const views: ViewWrapper[] = await Promise.all([inputs[0].v, inputs.length > 1 ? inputs[1].v : null]);
    const view = views[0];
    const target = views[1];
    const idtype = parameter.idtype ? IDTypeManager.getInstance().resolveIdType(parameter.idtype) : null;
    const range = ParseRangeUtils.parseRangeLike(parameter.range);

    const bak = view.getItemSelection();
    await Promise.resolve(view.setItemSelection({idtype, range}));
    if (target) {
      await Promise.resolve(target.setParameterSelection({idtype, range}));
    }
    return {
      inverse: inputs.length > 1 ? CmdUtils.setAndUpdateSelection(inputs[0], inputs[1], bak.idtype, bak.range) : CmdUtils.setSelection(inputs[0], bak.idtype, bak.range)
    };
  }

  static setSelection(view: IObjectRef<ViewWrapper>, idtype: IDType, range: Range) {
    // assert view
    return ActionUtils.action(ActionMetaData.actionMeta('Select ' + (idtype ? idtype.name : 'None'), ObjectRefUtils.category.selection, ObjectRefUtils.operation.update), CMD_SET_SELECTION, CmdUtils.setSelectionImpl, [view], {
      idtype: idtype ? idtype.id : null,
      range: range.toString()
    });
  }

  static setAndUpdateSelection(view: IObjectRef<ViewWrapper>, target: IObjectRef<ViewWrapper>, idtype: IDType, range: Range) {
    // assert view
    return ActionUtils.action(ActionMetaData.actionMeta('Select ' + (idtype ? idtype.name : 'None'), ObjectRefUtils.category.selection, ObjectRefUtils.operation.update), CMD_SET_SELECTION, CmdUtils.setSelectionImpl, [view, target], {
      idtype: idtype ? idtype.id : null,
      range: range.toString()
    });
  }

  /**
   * Factory function that compresses a series of action to fewer one.
   * Note: This function is referenced as `actionCompressor` in the package.json
   * @type {string}
   * @param path
   * @returns {Array}
   */
  static compressCreateRemove(path: ActionNode[]) {
    const r: ActionNode[] = [];

    function compatibilityReplaceView(previous: ActionNode) {
      //old replace view creates a new ref for each new view instead of reusing the old one
      if (previous.f_id !== CMD_REPLACE_VIEW) {
        return false;
      }
      // in case of the view created an ref (=old behavior) -> keep it
      return previous.creates.length > 0;
    }

    outer: for (const act of path) {
      if (act.f_id === CMD_REMOVE_VIEW) {
        const removed = act.removes[0];
        //removed view delete intermediate change and optional creation
        for (let j = r.length - 1; j >= 0; --j) { //back to forth for better removal
          const previous = r[j];
          const requires = previous.requires;
          const usesView = requires.indexOf(removed) >= 0;
          if (usesView && !compatibilityReplaceView(previous)) {
            r.splice(j, 1);
          } else if (previous.f_id === CMD_CREATE_VIEW && previous.creates[0] === removed) {
            //found adding remove both
            r.splice(j, 1);
            continue outer;
          }
        }
      }
      if (act.f_id === CMD_REPLACE_VIEW) {
        const view = act.requires[1];
        //changed the view in place can remove all previous set parameter/selection calls till the creation
        for (let j = r.length - 1; j >= 0; --j) { //back to forth for better removal
          const previous = r[j];
          const requires = previous.requires;
          const usesView = requires.indexOf(view) >= 0;
          //uses view (setParameter, replace, ...) but not its creation
          if (usesView && previous.f_id !== CMD_CREATE_VIEW) {
            r.splice(j, 1);
          }
        }
      }
      r.push(act);
    }
    return r;
  }

  static compressSetSelection(path: ActionNode[]) {
    return Compression.lastOnly(path, CMD_SET_SELECTION, (p: ActionNode) => `${p.parameter.idtype}@${p.requires[0].id}`);
  }
}
