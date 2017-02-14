/**
 * Created by Samuel Gratzl on 18.05.2016.
 */


import {IObjectRef, action, meta, cat, op, ICmdFunction, ProvenanceGraph} from 'phovea_core/src/provenance';
import NumberColumn, {createMappingFunction} from 'lineupjs/src/model/NumberColumn';
import StackColumn from 'lineupjs/src/model/StackColumn';
import ScriptColumn from 'lineupjs/src/model/ScriptColumn';
import LinkColumn from 'lineupjs/src/model/LinkColumn';
import CategoricalNumberColumn from 'lineupjs/src/model/CategoricalNumberColumn';
import CompositeColumn from 'lineupjs/src/model/CompositeColumn';
import Ranking from 'lineupjs/src/model/Ranking';
import Column from 'lineupjs/src/model/Column';
import {ALineUpView} from './LineUpView';

//TODO better solution
let ignoreNext:string = null;

function addRankingImpl(inputs:IObjectRef<any>[], parameter:any) {
  return inputs[0].v.then((value) => Promise.resolve(value.data)).then((p) => {
    const index = parameter.index;
    let ranking;
    if (parameter.dump) { //add
      ignoreNext = 'addRanking';
      p.insertRanking(p.restoreRanking(parameter.dump), index);
    } else { //remove
      ranking = p.getRankings()[index];
      ignoreNext = 'removeRanking';
      p.removeRanking(ranking);
    }
    return {
      inverse: addRanking(inputs[0], parameter.index, parameter.dump ? null: ranking.dump(p.toDescRef))
    };
  });
}

export function addRanking(provider:IObjectRef<any>, index:number, dump?:any) {
  return action(meta(dump ? 'Add Ranking' : 'Remove Ranking', cat.layout, dump ? op.create : op.remove), 'lineupAddRanking', addRankingImpl, [provider], {
    index,
    dump
  });
}

function toSortObject(v) {
  return { asc: v.asc, col: v.col ? v.col.fqpath : null };
}

function setRankingSortCriteriaImpl(inputs:IObjectRef<any>[], parameter:any) {
  return inputs[0].v.then((value) => Promise.resolve(value.data)).then((p) => {
    const ranking = p.getRankings()[parameter.rid];
    const bak = toSortObject(ranking.getSortCriteria());
    ignoreNext = 'sortCriteriaChanged';
    ranking.sortBy(parameter.value.col ? ranking.findByPath(parameter.value.col) : null, parameter.value.asc);

    return {
      inverse: setRankingSortCriteria(inputs[0], parameter.rid, bak)
    };
  });
}


export function setRankingSortCriteria(provider:IObjectRef<any>, rid:number, value:any) {
  return action(meta('Change Sort Criteria', cat.layout, op.update), 'lineupSetRankingSortCriteria', setRankingSortCriteriaImpl, [provider], {
    rid,
    value
  });
}

function setColumnImpl(inputs:IObjectRef<any>[], parameter:any) {
  return inputs[0].v.then((value) => Promise.resolve(value.data)).then((p) => {
    const ranking = p.getRankings()[parameter.rid];
    const prop = parameter.prop[0].toUpperCase() + parameter.prop.slice(1);

    let bak;
    let source = ranking;
    if (parameter.path) {
      source = ranking.findByPath(parameter.path);
    }
    ignoreNext = parameter.prop + 'Changed';
    if (parameter.prop === 'mapping' && source instanceof NumberColumn) {
      bak = source.getMapping().dump();
      source.setMapping(createMappingFunction(parameter.value));
    } else {
      bak = source['get' + prop]();
      source['set' + prop].call(source, parameter.value);
    }
    return {
      inverse: setColumn(inputs[0], parameter.rid, parameter.path, parameter.prop, bak)
    };
  });
}

export function setColumn(provider:IObjectRef<any>, rid:number, path:string, prop:string, value:any) {
  // assert ALineUpView and update the stats
  (<ALineUpView>provider.value.getInstance()).updateLineUpStats();

  return action(meta('Set Property ' + prop, cat.layout, op.update), 'lineupSetColumn', setColumnImpl, [provider], {
    rid,
    path,
    prop,
    value
  });
}

function addColumnImpl(inputs:IObjectRef<any>[], parameter:any) {
  return inputs[0].v.then((value) => Promise.resolve(value.data)).then((p) => {
    let ranking = p.getRankings()[parameter.rid];

    const index = parameter.index;
    let bak;
    if (parameter.path) {
      ranking = ranking.findByPath(parameter.path);
    }
    if (parameter.dump) { //add
      ignoreNext = 'addColumn';
      ranking.insert(p.restoreColumn(parameter.dump), index);
    } else { //remove
      bak = ranking.at(index);
      ignoreNext = 'removeColumn';
      ranking.remove(bak);
    }
    return {
      inverse: addColumn(inputs[0], parameter.rid, parameter.path, index, parameter.dump ? null : p.dumpColumn(bak))
    };
  });
}

export function addColumn(provider:IObjectRef<any>, rid:number, path:string, index:number, dump:any) {
  return action(meta(dump ? 'Add Column' : 'Remove Column', cat.layout, dump ? op.create : op.remove), 'lineupAddColumn', addColumnImpl, [provider], {
    rid,
    path,
    index,
    dump
  });
}

export function createCmd(id):ICmdFunction {
  switch (id) {
    case 'lineupAddRanking':
      return addRankingImpl;
    case 'lineupSetRankingSortCriteria':
      return setRankingSortCriteriaImpl;
    case 'lineupSetColumn':
      return setColumnImpl;
    case 'lineupAddColumn':
      return addColumnImpl;
  }
  return null;
}

function delayedCall(callback:(old:any, newValue:any) => void, timeToDelay = 100, thisCallback = this) {
  let tm = -1;
  let oldest = null;

  function callbackImpl(newValue) {
    callback.call(thisCallback, oldest, newValue);
    oldest = null;
    tm = -1;
  }

  return (old:any, newValue:any) => {
    if (tm >= 0) {
      clearTimeout(tm);
      tm = -1;
    } else {
      oldest = old;
    }
    tm = setTimeout(callbackImpl.bind(this, newValue), timeToDelay);
  };
}

function rankingId(provider:any, ranking:any) {
  return provider.getRankings().indexOf(ranking);
}


function recordPropertyChange(source:any, provider:any, lineupViewWrapper:IObjectRef<any>, graph:ProvenanceGraph, property:string, delayed = -1) {
  const f = (old:any, newValue:any) => {
    if (ignoreNext === property + 'Changed') {
      ignoreNext = null;
      return;
    }
    console.log(source, property, old, newValue);
    if (source instanceof Column) {
      // assert ALineUpView and update the stats
      (<ALineUpView>lineupViewWrapper.value.getInstance()).updateLineUpStats();

      const rid = rankingId(provider, source.findMyRanker());
      const path = source.fqpath;
      graph.pushWithResult(setColumn(lineupViewWrapper, rid, path, property, newValue), {
        inverse: setColumn(lineupViewWrapper, rid, path, property, old)
      });
    } else if (source instanceof Ranking) {
      const rid = rankingId(provider, source);
      graph.pushWithResult(setColumn(lineupViewWrapper, rid, null, property, newValue), {
        inverse: setColumn(lineupViewWrapper, rid, null, property, old)
      });
    }
  };
  source.on(property + 'Changed.track', delayed > 0 ? delayedCall(f, delayed) : f);
}

function trackColumn(provider, lineup:IObjectRef<any>, graph:ProvenanceGraph, col) {
  recordPropertyChange(col, provider, lineup, graph, 'metaData');
  recordPropertyChange(col, provider, lineup, graph, 'filter');
  //recordPropertyChange(col, provider, lineup, graph, 'width', 100);

  if (col instanceof CompositeColumn) {
    col.on('addColumn.track', (column, index:number) => {
      trackColumn(provider, lineup, graph, column);
      if (ignoreNext === 'addColumn') {
        ignoreNext = null;
        return;
      }
      console.log(col.fqpath, 'addColumn', column, index);
      const d = provider.dumpColumn(column);
      const rid = rankingId(provider, col.findMyRanker());
      const path = col.fqpath;
      graph.pushWithResult(addColumn(lineup, rid, path, index, d), {
        inverse: addColumn(lineup, rid, path, index, null)
      });
    });
    col.on('removeColumn.track', (column, index:number) => {
      untrackColumn(column);
      if (ignoreNext === 'removeColumn') {
        ignoreNext = null;
        return;
      }
      console.log(col.fqpath, 'addColumn', column, index);
      const d = provider.dumpColumn(column);
      const rid = rankingId(provider, col.findMyRanker());
      const path = col.fqpath;
      graph.pushWithResult(addColumn(lineup, rid, path, index, null), {
        inverse: addColumn(lineup, rid, path, index, d)
      });
    });
    col.children.forEach(trackColumn.bind(this, provider, lineup, graph));

    if (col instanceof StackColumn) {
      recordPropertyChange(col, provider, lineup, graph, 'weights', 100);
    }
  } else if (col instanceof NumberColumn) {
    col.on('mappingChanged.track', (old, newValue) => {
      if (ignoreNext === 'mappingChanged') {
        ignoreNext = null;
        return;
      }
      console.log(col.fqpath, 'mapping', old.dump(), newValue.dump());
      const rid = rankingId(provider, col.findMyRanker());
      const path = col.fqpath;
      graph.pushWithResult(setColumn(lineup, rid, path, 'mapping', newValue.dump()), {
        inverse: setColumn(lineup, rid, path, 'mapping', old.dump())
      });
    });
  } else if (col instanceof ScriptColumn) {
    recordPropertyChange(col, provider, lineup, graph, 'script');
  } else if (col instanceof LinkColumn) {
    recordPropertyChange(col, provider, lineup, graph, 'link');
  } else if (col instanceof CategoricalNumberColumn) {
    recordPropertyChange(col, provider, lineup, graph, 'mapping');
  }
}


function untrackColumn(col) {
  col.on(['metaDataChanged.filter', 'filterChanged.track', 'widthChanged.track'], null);

  if (col instanceof CompositeColumn) {
    col.on(['addColumn.track', 'removeColumn.track'], null);
    col.children.forEach(untrackColumn);
  } else if (col instanceof NumberColumn) {
    col.on('mappingChanged.track', null);
  } else if (col instanceof ScriptColumn) {
    col.on('scriptChanged.track', null);
  } else if (col instanceof LinkColumn) {
    col.on('linkChanged.track', null);
  }
}

function trackRanking(provider, lineup:IObjectRef<any>, graph:ProvenanceGraph, ranking) {
  ranking.on('sortCriteriaChanged.track', (old, newValue) => {
    if (ignoreNext === 'sortCriteriaChanged') {
      ignoreNext = null;
      return;
    }
    console.log(ranking.id, 'sortCriteriaChanged', old, newValue);
    const rid = rankingId(provider, ranking);
    graph.pushWithResult(setRankingSortCriteria(lineup, rid, toSortObject(newValue)), {
      inverse: setRankingSortCriteria(lineup, rid, toSortObject(old))
    });
  });
  ranking.on('addColumn.track', (column, index:number) => {
    trackColumn(provider, lineup, graph, column);
    if (ignoreNext === 'addColumn') {
      ignoreNext = null;
      return;
    }
    console.log(ranking, 'addColumn', column, index);
    const d = provider.dumpColumn(column);
    const rid = rankingId(provider, ranking);
    graph.pushWithResult(addColumn(lineup, rid, null, index, d), {
      inverse: addColumn(lineup, rid, null, index, null)
    });
  });
  ranking.on('removeColumn.track', (column, index:number) => {
    untrackColumn(column);
    if (ignoreNext === 'removeColumn') {
      ignoreNext = null;
      return;
    }
    console.log(ranking, 'removeColumn', column, index);
    const d = provider.dumpColumn(column);
    const rid = rankingId(provider, ranking);
    graph.pushWithResult(addColumn(lineup, rid, null, index, null), {
      inverse: addColumn(lineup, rid, null, index, d)
    });
  });
  ranking.children.forEach(trackColumn.bind(this, provider, lineup, graph));
}

function untrackRanking(ranking) {
  ranking.on(['sortCriteriaChanged.track', 'addColumn.track', 'removeColumn.track'], null);
  ranking.children.forEach(untrackColumn);
}

/**
 * clueifies lineup
 * @param lineup the object ref on the lineup provider instance
 * @param graph
 */
export function clueify(lineup:IObjectRef<any>, graph:ProvenanceGraph) {
  return lineup.v.then((value) => Promise.resolve(value.data)).then((p) => {
    p.on('addRanking', (ranking, index:number) => {
      if (ignoreNext === 'addRanking') {
        ignoreNext = null;
        return;
      }
      const d = ranking.dump(p.toDescRef);
      graph.pushWithResult(addRanking(lineup, index, d), {
        inverse: addRanking(lineup, index, null)
      });
      trackRanking(p, lineup, graph, ranking);
    });
    p.on('removeRanking', (ranking, index:number) => {
      if (ignoreNext === 'removeRanking') {
        ignoreNext = null;
        return;
      }
      const d = ranking.dump(p.toDescRef);
      graph.pushWithResult(addRanking(lineup, index, null), {
        inverse: addRanking(lineup, index, d)
      });
      untrackRanking(ranking);
    });
    p.getRankings().forEach(trackRanking.bind(this, p, lineup, graph));
  });
}

export function untrack(lineup:IObjectRef<any>) {
  return lineup.v.then((value) => Promise.resolve(value.data)).then((p) => {
    p.on(['addRanking.track', 'removeRanking.track'], null);
    p.getRankings().forEach(untrackRanking);
  });
}

