/**
 * Created by Samuel Gratzl on 18.05.2016.
 */


import {IObjectRef, action, meta, cat, op, ICmdFunction, ProvenanceGraph, ActionNode} from 'phovea_core/src/provenance';
import {get as getPlugin} from 'phovea_core/src/plugin';
import Column from 'lineupjs/src/model/Column';
import IScore from './IScore';

export const EXTENSION_POINT_SCORE_IMPL = 'ordinoScoreImpl';
export const CMD_ADD_SCORE = 'ordinoAddScore';
export const CMD_REMOVE_SCORE = 'ordinoRemoveScore';


export interface IViewProvider {
  getInstance(): {
    addTrackedScoreColumn(score: IScore<any>): Promise<{ col: Column, loaded: Promise<Column>}>;
    removeTrackedScoreColumn(columnId: string);
  };
}

async function addScoreLogic(waitForScore: boolean, inputs:IObjectRef<IViewProvider>[], parameter:any) {
  const scoreId: string = parameter.id;
  const pluginDesc = getPlugin(EXTENSION_POINT_SCORE_IMPL, scoreId);
  const plugin = await pluginDesc.load();
  const view = await inputs[0].v.then((vi) => vi.getInstance());
  const score: IScore<any>|IScore<any>[] = plugin.factory(parameter.params, pluginDesc);
  const scores = Array.isArray(score) ? score : [score];

  const results = await Promise.all(scores.map((s) => view.addTrackedScoreColumn(s)));
  const col = waitForScore ? await Promise.all(results.map((r) => r.loaded)) : results.map((r) => r.col);

  return {
    inverse: removeScore(inputs[0], scoreId, parameter.params, col.map((c) => c.id))
  };
}

function addScoreImpl(inputs:IObjectRef<IViewProvider>[], parameter:any) {
  return addScoreLogic(true, inputs, parameter);
}

async function addScoreAsync(inputs:IObjectRef<IViewProvider>[], parameter:any) {
  return addScoreLogic(false, inputs, parameter);
}


async function removeScoreImpl(inputs:IObjectRef<IViewProvider>[], parameter:any) {
  const view = await inputs[0].v.then((vi) => vi.getInstance());
  const columnId: string|string[] = parameter.columnId;
  const columnIds = Array.isArray(columnId) ? columnId : [columnId];

  columnIds.forEach((id) => view.removeTrackedScoreColumn(id));

  return {
    inverse: addScore(inputs[0], parameter.id, parameter.params)
  };
}

export function addScore(provider:IObjectRef<IViewProvider>, scoreId: string, params: any) {
  return action(meta('Add Score', cat.data, op.create), CMD_ADD_SCORE, addScoreImpl, [provider], {
    id: scoreId,
    params
  });
}

export async function pushScoreAsync(graph: ProvenanceGraph, provider:IObjectRef<IViewProvider>, scoreId: string, params: any) {
  const actionParams = {id: scoreId, params};
  const result = await addScoreAsync([provider], actionParams);
  return graph.pushWithResult(action(meta('Add Score', cat.data, op.create), CMD_ADD_SCORE, addScoreImpl, [provider], actionParams), result);
}

export function removeScore(provider:IObjectRef<IViewProvider>, scoreId: string, params: any, columnId: string|string[]) {
  return action(meta('Remove Score', cat.data, op.remove), CMD_REMOVE_SCORE, removeScoreImpl, [provider], {
    id: scoreId,
    params,
    columnId
  });
}

function shallowEqualObjects(a: any, b: any) {
  if (a === b) {
    return true;
  }
  if (a === null || b === null) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  if (keysA.some((k) => keysB.indexOf(k) <0)) {
    return false;
  }
  return keysA.every((k) => {
    const va = a[k];
    const vb = b[k];
    return va === vb;
  });
}

/**
 * compresses score creation and removal
 */
export function compress(path:ActionNode[]) {
  const manipulate = path.slice();
  const r: ActionNode[] = [];
  outer: for (let i = 0; i < manipulate.length; ++i) {
    const act = manipulate[i];
    if (act.f_id === CMD_ADD_SCORE) {
      // try to find its removal
      for (let j = i + 1; j < manipulate.length; ++j) {
        const next = manipulate[j];
        if (next.f_id === CMD_REMOVE_SCORE && shallowEqualObjects(act.parameter, next.parameter)) {
          //TODO remove lineup actions that uses this score -> how to identify?
          //found match, delete both
          manipulate.slice(j, 1); //delete remove cmd
          continue outer; //skip adding of add cmd
        }
      }
    }
    r.push(act);
  }
  return r;
}


export function createCmd(id):ICmdFunction {
  switch (id) {
    case CMD_ADD_SCORE:
      return addScoreImpl;
    case CMD_REMOVE_SCORE:
      return removeScoreImpl;
  }
  return null;
}
