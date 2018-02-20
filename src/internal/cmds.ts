/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/


import {
  action,
  ActionNode,
  cat,
  IAction,
  ICmdResult,
  IObjectRef,
  meta,
  op,
  ProvenanceGraph
} from 'phovea_core/src/provenance';
import {get as getPlugin} from 'phovea_core/src/plugin';
import {none, parse, Range} from 'phovea_core/src/range';
import {IDType, resolve} from 'phovea_core/src/idtype';
import ViewWrapper, {createViewWrapper, replaceViewWrapper} from './ViewWrapper';
import OrdinoApp from './OrdinoApp';
import {EXTENSION_POINT_TDP_VIEW} from 'tdp_core/src/extensions';
import {lastOnly} from 'phovea_clue/src/compress';

const CMD_CREATE_VIEW = 'targidCreateView';
const CMD_REMOVE_VIEW = 'targidRemoveView';
const CMD_REPLACE_VIEW = 'targidReplaceView';
const CMD_SET_SELECTION = 'targidSetSelection';

/**
 * Creates a view instance and wraps the instance with the inverse action in a CLUE command
 * @param inputs Array with object references, where the first one is the OrdinoApp object
 * @param parameter Parameter such idtype, selection and view options
 * @param graph The Provenance graph
 * @returns {Promise<ICmdResult>}
 */
export async function createViewImpl(inputs: IObjectRef<any>[], parameter: any, graph: ProvenanceGraph): Promise<ICmdResult> {
  const app: OrdinoApp = inputs[0].value;
  const viewId: string = parameter.viewId;
  const idtype = parameter.idtype ? resolve(parameter.idtype) : null; // creates a new object
  const selection = parameter.selection ? parse(parameter.selection) : none(); // creates a new object
  const options = parameter.options;

  const view = getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);

  const viewWrapperInstance = await createViewWrapper(graph, {idtype, range: selection}, app.node, view, options);
  if (viewWrapperInstance.built) {
    await viewWrapperInstance.built;
  }
  const oldFocus = await app.pushImpl(viewWrapperInstance);
  return {
    created: [viewWrapperInstance.ref],
    inverse: (inputs, created, removed) => removeView(inputs[0], created[0], oldFocus)
  };
}

/**
 * Removes a view instance and wraps the instance with the inverse action in a CLUE command
 * @param inputs Array with object references, where the first one is the OrdinoApp object
 * @param parameter Parameter such idtype, selection and view options
 * @returns {ICmdResult}
 */
export function removeViewImpl(inputs: IObjectRef<any>[], parameter): ICmdResult {
  const app: OrdinoApp = inputs[0].value;
  const view: ViewWrapper = inputs[1].value;
  const oldFocus: number = parameter.focus;

  app.removeImpl(view, oldFocus);
  return {
    removed: [inputs[1]],
    inverse: createView(inputs[0], view.desc.id, view.selection.idtype, view.selection.range, view.options)
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
export async function replaceViewImpl(inputs: IObjectRef<any>[], parameter: any): Promise<ICmdResult> {
  const app: OrdinoApp = inputs[0].value;
  const existingView: ViewWrapper = inputs[1].value;

  const oldParams = {
    viewId: existingView.desc.id,
    idtype: existingView.selection.idtype,
    selection: existingView.selection.range,
    options: existingView.options
  };

  const viewId: string = parameter.viewId;
  const idtype = parameter.idtype ? resolve(parameter.idtype) : null; // creates a new object
  const selection = parameter.selection ? parse(parameter.selection) : none(); // creates a new object
  const options = parameter.options;

  // create new (inner) view
  const view = getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);

  await replaceViewWrapper(existingView, {idtype, range: selection}, view, options);

  app.update();

  return {
    inverse: replaceView(inputs[0], inputs[1], oldParams.viewId, oldParams.idtype, oldParams.selection, oldParams.options)
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
export function createView(app: IObjectRef<OrdinoApp>, viewId: string, idtype: IDType, selection: Range, options?): IAction {
  const view = getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
  // assert view
  return action(meta('Add ' + view.name, cat.visual, op.create), CMD_CREATE_VIEW, createViewImpl, [app], {
    viewId,
    idtype: idtype ? idtype.id : null,
    selection: selection ? selection.toString() : none().toString(),
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
export function removeView(app: IObjectRef<OrdinoApp>, view: IObjectRef<ViewWrapper>, oldFocus = -1): IAction {
  // assert view
  return action(meta('Remove ' + view.toString(), cat.visual, op.remove), CMD_REMOVE_VIEW, removeViewImpl, [app, view], {
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
export function replaceView(app: IObjectRef<OrdinoApp>, existingView: IObjectRef<ViewWrapper>, viewId: string, idtype: IDType, selection: Range, options?): IAction {
  const view = getPlugin(EXTENSION_POINT_TDP_VIEW, viewId);
  // assert view
  return action(meta('Replace ' + existingView.name + ' with ' + view.name, cat.visual, op.update), CMD_REPLACE_VIEW, replaceViewImpl, [app, existingView], {
    viewId,
    idtype: idtype ? idtype.id : null,
    selection: selection ? selection.toString() : none().toString(),
    options
  });
}

export async function setSelectionImpl(inputs: IObjectRef<any>[], parameter) {
  const views: ViewWrapper[] = await Promise.all([inputs[0].v, inputs.length > 1 ? inputs[1].v : null]);
  const view = views[0];
  const target = views[1];
  const idtype = parameter.idtype ? resolve(parameter.idtype) : null;
  const range = parse(parameter.range);

  const bak = view.getItemSelection();
  await Promise.resolve(view.setItemSelection({idtype, range}));
  if (target) {
    await Promise.resolve(target.setParameterSelection({idtype, range}));
  }
  return {
    inverse: inputs.length > 1 ? setAndUpdateSelection(inputs[0], inputs[1], bak.idtype, bak.range) : setSelection(inputs[0], bak.idtype, bak.range)
  };
}

export function setSelection(view: IObjectRef<ViewWrapper>, idtype: IDType, range: Range) {
  // assert view
  return action(meta('Select ' + (idtype ? idtype.name : 'None'), cat.selection, op.update), CMD_SET_SELECTION, setSelectionImpl, [view], {
    idtype: idtype ? idtype.id : null,
    range: range.toString()
  });
}

export function setAndUpdateSelection(view: IObjectRef<ViewWrapper>, target: IObjectRef<ViewWrapper>, idtype: IDType, range: Range) {
  // assert view
  return action(meta('Select ' + (idtype ? idtype.name : 'None'), cat.selection, op.update), CMD_SET_SELECTION, setSelectionImpl, [view, target], {
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
export function compressCreateRemove(path: ActionNode[]) {
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

export function compressSetSelection(path: ActionNode[]) {
  return lastOnly(path, CMD_SET_SELECTION, (p: ActionNode) => `${p.parameter.idtype}@${p.requires[0].id}`);
}
