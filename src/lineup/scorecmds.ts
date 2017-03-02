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
  const plugin = await getPlugin(EXTENSION_POINT_SCORE_IMPL, scoreId).load();
  const view = await inputs[0].v.then((vi) => vi.getInstance());
  const score: IScore<any> = plugin.factory(parameter.params);

  const r = await view.addTrackedScoreColumn(score);
  const col = waitForScore ? await r.loaded : r.col;

  return {
    inverse: removeScore(inputs[0], scoreId, parameter.params, col.id)
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
  const columnId: string = parameter.columnId;

  view.removeTrackedScoreColumn(columnId);

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

export function removeScore(provider:IObjectRef<IViewProvider>, scoreId: string, params: any, columnId: string) {
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
  const r = [];
  for (const p of path) {
    if (p.f_id === CMD_ADD_SCORE && r.length > 0) {
      const last = r[r.length - 1];
      if (last.f_id === CMD_REMOVE_SCORE && shallowEqualObjects(p.parameter, last.parameter)) {
        r.pop();
        continue;
      }
    }
    r.push(p);
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
