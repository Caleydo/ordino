/**
 * Created by sam on 03.03.2017.
 */

import {
  IObjectRef,
  ProvenanceGraph,
  action,
  meta,
  op,
  cat,
  ICmdFunction,
  ActionNode,
  StateNode
} from 'phovea_core/src/provenance';
import {get as getPlugin} from 'phovea_core/src/plugin';
import {Range, parse, none} from 'phovea_core/src/range';
import {resolve, IDType} from 'phovea_core/src/idtype';
import {
  ViewWrapper, createViewWrapper, replaceViewWrapper
} from './View';
import {ICmdResult, IAction} from 'phovea_core/src/provenance';
import TargidConstants from './constants';
import Targid from './Targid';
import * as session from 'phovea_core/src/session';
import {nest} from 'd3';

/**
 * Creates a view instance and wraps the instance with the inverse action in a CLUE command
 * @param inputs Array with object references, where the first one is the TargId object
 * @param parameter Parameter such idtype, selection and view options
 * @param graph The Provenance graph
 * @returns {Promise<ICmdResult>}
 */
export async function createViewImpl(inputs: IObjectRef<any>[], parameter: any, graph: ProvenanceGraph): Promise<ICmdResult> {
  const targid: Targid = inputs[0].value;
  const viewId: string = parameter.viewId;
  const idtype = parameter.idtype ? resolve(parameter.idtype) : null; // creates a new object
  const selection = parameter.selection ? parse(parameter.selection) : none(); // creates a new object
  const options = parameter.options;

  const view = getPlugin(TargidConstants.VIEW, viewId);

  const viewWrapperInstance = await createViewWrapper(graph, {idtype, range: selection}, targid.node, view, options);
  const oldFocus = await targid.pushImpl(viewWrapperInstance);
  return {
    created: [viewWrapperInstance.ref],
    inverse: (inputs, created, removed) => removeView(inputs[0], created[0], oldFocus)
  };
}

/**
 * Removes a view instance and wraps the instance with the inverse action in a CLUE command
 * @param inputs Array with object references, where the first one is the TargId object
 * @param parameter Parameter such idtype, selection and view options
 * @returns {ICmdResult}
 */
export function removeViewImpl(inputs: IObjectRef<any>[], parameter): ICmdResult {
  const targid: Targid = inputs[0].value;
  const view: ViewWrapper = inputs[1].value;
  const oldFocus: number = parameter.focus;

  targid.removeImpl(view, oldFocus);
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
 * @param inputs Array with object references, where the first one is the TargId object
 * @param parameter Parameter such idtype, selection and view options
 * @returns {Promise<ICmdResult>}
 */
export async function replaceViewImpl(inputs: IObjectRef<any>[], parameter: any): Promise<ICmdResult> {
  const targid: Targid = inputs[0].value;
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
  const view = getPlugin(TargidConstants.VIEW, viewId);

  await replaceViewWrapper(existingView, {idtype, range: selection}, view, options);

  targid.update();

  return {
    created: [existingView.ref],
    inverse: (inputs, created, removed) => replaceView(inputs[0], created[0], oldParams.viewId, oldParams.idtype, oldParams.selection, oldParams.options)
  };
}

/**
 * Creates a view and adds a CLUE command view to the provenance graph
 * @param targid
 * @param viewId
 * @param idtype
 * @param selection
 * @param options
 * @returns {IAction}
 */
export function createView(targid: IObjectRef<Targid>, viewId: string, idtype: IDType, selection: Range, options?): IAction {
  const view = getPlugin(TargidConstants.VIEW, viewId);
  // assert view
  return action(meta('Add ' + view.name, cat.visual, op.create), TargidConstants.CMD_CREATE_VIEW, createViewImpl, [targid], {
    viewId,
    idtype: idtype ? idtype.id : null,
    selection: selection ? selection.toString() : none().toString(),
    options
  });
}

/**
 * Removes a view and adds a CLUE command view to the provenance graph
 * @param targid
 * @param view ViewWrapper instance of the view
 * @param oldFocus
 * @returns {IAction}
 */
export function removeView(targid: IObjectRef<Targid>, view: IObjectRef<ViewWrapper>, oldFocus = -1): IAction {
  // assert view
  return action(meta('Remove ' + view.toString(), cat.visual, op.remove), TargidConstants.CMD_REMOVE_VIEW, removeViewImpl, [targid, view], {
    viewId: view.value.desc.id,
    focus: oldFocus
  });
}

/**
 * Replaces an (inner) view of an existing ViewWrapper and adds a CLUE command view to the provenance graph
 * @param targid
 * @param existingView
 * @param viewId
 * @param idtype
 * @param selection
 * @param options
 * @returns {IAction}
 */
export function replaceView(targid: IObjectRef<Targid>, existingView: IObjectRef<ViewWrapper>, viewId: string, idtype: IDType, selection: Range, options?): IAction {
  const view = getPlugin(TargidConstants.VIEW, viewId);
  // assert view
  return action(meta('Replace ' + existingView.name + ' with ' + view.name, cat.visual, op.update), TargidConstants.CMD_REPLACE_VIEW, replaceViewImpl, [targid, existingView], {
    viewId,
    idtype: idtype ? idtype.id : null,
    selection: selection ? selection.toString() : none().toString(),
    options
  });
}

function initSessionImpl(inputs, parameters) {
  const old = {};
  Object.keys(parameters).forEach((key) => {
    old[key] = session.retrieve(key, null);
    const value = parameters[key];
    if (value !== null) {
      session.store(key, parameters[key]);
    }
  });
  return {
    inverse: initSession(old)
  };
}

export function initSession(map: any) {
  return action(meta('Initialize Session', cat.custom, op.update), TargidConstants.CMD_INIT_SESSION, initSessionImpl, [], map);
}


export async function setParameterImpl(inputs: IObjectRef<any>[], parameter, graph: ProvenanceGraph) {
  const view: ViewWrapper = await inputs[0].v;
  const name = parameter.name;
  const value = parameter.value;

  const bak = view.getParameter(name);
  view.setParameterImpl(name, value);
  return {
    inverse: setParameter(inputs[0], name, bak)
  };
}

export function setParameter(view: IObjectRef<ViewWrapper>, name: string, value: any) {
  //assert view
  return action(meta('Set Parameter "' + name + '"', cat.visual, op.update), TargidConstants.CMD_SET_PARAMETER, setParameterImpl, [view], {
    name,
    value
  });
}

export async function setSelectionImpl(inputs: IObjectRef<any>[], parameter) {
  const views: ViewWrapper[] = await Promise.all([inputs[0].v, inputs.length > 1 ? inputs[1].v : null]);
  const view = views[0];
  const target = views[1];
  const idtype = parameter.idtype ? resolve(parameter.idtype) : null;
  const range = parse(parameter.range);

  const bak = view.getItemSelection();
  view.setItemSelection({idtype, range});
  if (target) {
    target.setParameterSelection({idtype, range});
  }
  return {
    inverse: inputs.length > 1 ? setAndUpdateSelection(inputs[0], inputs[1], bak.idtype, bak.range) : setSelection(inputs[0], bak.idtype, bak.range)
  };
}

export function setSelection(view: IObjectRef<ViewWrapper>, idtype: IDType, range: Range) {
  // assert view
  return action(meta('Select ' + (idtype ? idtype.name : 'None'), cat.selection, op.update), TargidConstants.CMD_SET_SELECTION, setSelectionImpl, [view], {
    idtype: idtype ? idtype.id : null,
    range: range.toString()
  });
}

export function setAndUpdateSelection(view: IObjectRef<ViewWrapper>, target: IObjectRef<ViewWrapper>, idtype: IDType, range: Range) {
  // assert view
  return action(meta('Select ' + (idtype ? idtype.name : 'None'), cat.selection, op.update), TargidConstants.CMD_SET_SELECTION, setSelectionImpl, [view, target], {
    idtype: idtype ? idtype.id : null,
    range: range.toString()
  });
}


/**
 * Create a CLUE command by ID
 * @param id
 * @returns {ICmdFunction|null}
 */
export function createCmd(id): ICmdFunction {
  switch (id) {
    case TargidConstants.CMD_CREATE_VIEW:
      return createViewImpl;
    case TargidConstants.CMD_REMOVE_VIEW:
      return removeViewImpl;
    case TargidConstants.CMD_REPLACE_VIEW:
      return replaceViewImpl;
    case TargidConstants.CMD_INIT_SESSION:
      return initSessionImpl;
    case TargidConstants.CMD_SET_PARAMETER:
      return setParameterImpl;
    case TargidConstants.CMD_SET_SELECTION:
      return setSelectionImpl;
  }
  return null;
}

/**
 * Factory function that compresses a series of action to fewer one.
 * Note: This function is referenced as `actionCompressor` in the package.json
 * @type {string}
 * @param path
 * @returns {Array}
 */
export function compressCreateRemove(path: ActionNode[]) {
  const r = [];
  for (const p of path) {
    if (p.f_id === TargidConstants.CMD_REMOVE_VIEW && r.length > 0) {
      const last = r[r.length - 1];
      if (last.f_id === TargidConstants.CMD_CREATE_VIEW && p.parameter.viewId === last.parameter.viewId) {
        r.pop();
        continue;
      }
    }
    r.push(p);
  }
  return r;
}

/**
 * compresses the given path by removing redundant focus operations
 * @param path
 * @returns {ActionNode[]}
 */
export function compressSetParameter(path: ActionNode[]) {
  const possible = path.filter((p) => p.f_id === TargidConstants.CMD_SET_PARAMETER);
  //group by view and parameter
  const toKey = (p: ActionNode) => p.requires[0].id + '_' + p.parameter.name;
  const last = nest().key(toKey).map(possible);
  return path.filter((p) => {
    if (p.f_id !== TargidConstants.CMD_SET_PARAMETER) {
      return true;
    }
    const elems = last[toKey(p)];
    return elems[elems.length - 1] === p; //just the last survives
  });
}

export function compressSetSelection(path: ActionNode[]) {
  const lastByIDType: any = {};
  path.forEach((p) => {
    if (p.f_id === TargidConstants.CMD_SET_SELECTION) {
      const para = p.parameter;
      lastByIDType[para.idtype + '@' + p.requires[0].id] = p;
    }
  });
  return path.filter((p) => {
    if (p.f_id !== TargidConstants.CMD_SET_SELECTION) {
      return true;
    }
    const para = p.parameter;
    //last one remains
    return lastByIDType[para.idtype + '@' + p.requires[0].id] === p;
  });
}
