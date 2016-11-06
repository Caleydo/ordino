/**
 * Created by Samuel Gratzl on 18.05.2016.
 */


import * as prov from 'phovea_core/src/provenance';
import * as lineupjs from 'lineupjs';
import {ALineUpView} from './LineUpView';

//TODO better solution
var ignoreNext:string = null;

function addRankingImpl(inputs:prov.IObjectRef<any>[], parameter:any) {
  return inputs[0].v.then((value) => Promise.resolve(value.data)).then((p) => {
    let index = parameter.index;
    var ranking;
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

export function addRanking(provider:prov.IObjectRef<any>, index:number, dump?:any) {
  return prov.action(prov.meta(dump ? 'Add Ranking' : 'Remove Ranking', prov.cat.layout, dump ? prov.op.create : prov.op.remove), 'lineupAddRanking', addRankingImpl, [provider], {
    index: index,
    dump: dump
  });
}

function toSortObject(v) {
  return { asc: v.asc, col: v.col ? v.col.fqpath : null };
}

function setRankingSortCriteriaImpl(inputs:prov.IObjectRef<any>[], parameter:any) {
  return inputs[0].v.then((value) => Promise.resolve(value.data)).then((p) => {
    let ranking = p.getRankings()[parameter.rid];
    const bak = toSortObject(ranking.getSortCriteria());
    ignoreNext = 'sortCriteriaChanged';
    ranking.sortBy(parameter.value.col ? ranking.findByPath(parameter.value.col) : null, parameter.value.asc);

    return {
      inverse: setRankingSortCriteria(inputs[0], parameter.rid, bak)
    };
  });
}


export function setRankingSortCriteria(provider:prov.IObjectRef<any>, rid:number, value:any) {
  return prov.action(prov.meta('Change Sort Criteria', prov.cat.layout, prov.op.update), 'lineupSetRankingSortCriteria', setRankingSortCriteriaImpl, [provider], {
    rid: rid,
    value: value
  });
}

function setColumnImpl(inputs:prov.IObjectRef<any>[], parameter:any) {
  return inputs[0].v.then((value) => Promise.resolve(value.data)).then((p) => {
    let ranking = p.getRankings()[parameter.rid];
    let prop = parameter.prop[0].toUpperCase() + parameter.prop.slice(1);

    var bak;
    var source = ranking;
    if (parameter.path) {
      source = ranking.findByPath(parameter.path);
    }
    ignoreNext = parameter.prop + 'Changed';
    if (parameter.prop === 'mapping' && source instanceof lineupjs.model.NumberColumn) {
      bak = source.getMapping().dump();
      source.setMapping(lineupjs.model.createMappingFunction(parameter.value));
    } else {
      bak = source['get' + prop]();
      source['set' + prop].call(source, parameter.value);
    }
    return {
      inverse: setColumn(inputs[0], parameter.rid, parameter.path, parameter.prop, bak)
    };
  });
}

export function setColumn(provider:prov.IObjectRef<any>, rid:number, path:string, prop:string, value:any) {
  // assert ALineUpView and update the stats
  (<ALineUpView>provider.value.getInstance()).updateLineUpStats();

  return prov.action(prov.meta('Set Property ' + prop, prov.cat.layout, prov.op.update), 'lineupSetColumn', setColumnImpl, [provider], {
    rid: rid,
    path: path,
    prop: prop,
    value: value
  });
}

function addColumnImpl(inputs:prov.IObjectRef<any>[], parameter:any) {
  return inputs[0].v.then((value) => Promise.resolve(value.data)).then((p) => {
    var ranking = p.getRankings()[parameter.rid];

    let index = parameter.index;
    var bak;
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

export function addColumn(provider:prov.IObjectRef<any>, rid:number, path:string, index:number, dump:any) {
  return prov.action(prov.meta(dump ? 'Add Column' : 'Remove Column', prov.cat.layout, dump ? prov.op.create : prov.op.remove), 'lineupAddColumn', addColumnImpl, [provider], {
    rid: rid,
    path: path,
    index: index,
    dump: dump
  });
}

export function createCmd(id):prov.ICmdFunction {
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

function delayedCall(callback:(old:any, new_:any) => void, timeToDelay = 100, thisCallback = this) {
  var tm = -1;
  var oldest = null;

  function callbackImpl(new_) {
    callback.call(thisCallback, oldest, new_);
    oldest = null;
    tm = -1;
  }

  return (old:any, new_:any) => {
    if (tm >= 0) {
      clearTimeout(tm);
      tm = -1;
    } else {
      oldest = old;
    }
    tm = setTimeout(callbackImpl.bind(this, new_), timeToDelay);
  };
}

function rankingId(provider:any, ranking:any) {
  return provider.getRankings().indexOf(ranking);
}


function recordPropertyChange(source:any, provider:any, lineupViewWrapper:prov.IObjectRef<any>, graph:prov.ProvenanceGraph, property:string, delayed = -1) {
  const f = (old:any, new_:any) => {
    if (ignoreNext === property + 'Changed') {
      ignoreNext = null;
      return;
    }
    console.log(source, property, old, new_);
    if (source instanceof lineupjs.model.Column) {
      // assert ALineUpView and update the stats
      (<ALineUpView>lineupViewWrapper.value.getInstance()).updateLineUpStats();

      const rid = rankingId(provider, source.findMyRanker());
      const path = source.fqpath;
      graph.pushWithResult(setColumn(lineupViewWrapper, rid, path, property, new_), {
        inverse: setColumn(lineupViewWrapper, rid, path, property, old)
      });
    } else if (source instanceof lineupjs.model.Ranking) {
      const rid = rankingId(provider, source);
      graph.pushWithResult(setColumn(lineupViewWrapper, rid, null, property, new_), {
        inverse: setColumn(lineupViewWrapper, rid, null, property, old)
      });
    }
  };
  source.on(property + 'Changed.track', delayed > 0 ? delayedCall(f, delayed) : f);
}

function trackColumn(provider, lineup:prov.IObjectRef<any>, graph:prov.ProvenanceGraph, col) {
  recordPropertyChange(col, provider, lineup, graph, 'metaData');
  recordPropertyChange(col, provider, lineup, graph, 'filter');
  //recordPropertyChange(col, provider, lineup, graph, 'width', 100);

  if (col instanceof lineupjs.model.CompositeColumn) {
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

    if (col instanceof lineupjs.model.StackColumn) {
      recordPropertyChange(col, provider, lineup, graph, 'weights', 100);
    }
  } else if (col instanceof lineupjs.model.NumberColumn) {
    col.on('mappingChanged.track', (old, new_) => {
      if (ignoreNext === 'mappingChanged') {
        ignoreNext = null;
        return;
      }
      console.log(col.fqpath, 'mapping', old.dump(), new_.dump());
      const rid = rankingId(provider, col.findMyRanker());
      const path = col.fqpath;
      graph.pushWithResult(setColumn(lineup, rid, path, 'mapping', new_.dump()), {
        inverse: setColumn(lineup, rid, path, 'mapping', old.dump())
      });
    });
  } else if (col instanceof lineupjs.model.ScriptColumn) {
    recordPropertyChange(col, provider, lineup, graph, 'script');
  } else if (col instanceof lineupjs.model.LinkColumn) {
    recordPropertyChange(col, provider, lineup, graph, 'link');
  } else if (col instanceof lineupjs.model.CategoricalNumberColumn) {
    recordPropertyChange(col, provider, lineup, graph, 'mapping');
  }
}


function untrackColumn(col) {
  col.on(['metaDataChanged.filter', 'filterChanged.track', 'widthChanged.track'], null);

  if (col instanceof lineupjs.model.CompositeColumn) {
    col.on(['addColumn.track', 'removeColumn.track'], null);
    col.children.forEach(untrackColumn);
  } else if (col instanceof lineupjs.model.NumberColumn) {
    col.on('mappingChanged.track', null);
  } else if (col instanceof lineupjs.model.ScriptColumn) {
    col.on('scriptChanged.track', null);
  } else if (col instanceof lineupjs.model.LinkColumn) {
    col.on('linkChanged.track', null);
  }
}

function trackRanking(provider, lineup:prov.IObjectRef<any>, graph:prov.ProvenanceGraph, ranking) {
  ranking.on('sortCriteriaChanged.track', (old, new_) => {
    if (ignoreNext === 'sortCriteriaChanged') {
      ignoreNext = null;
      return;
    }
    console.log(ranking.id, 'sortCriteriaChanged', old, new_);
    const rid = rankingId(provider, ranking);
    graph.pushWithResult(setRankingSortCriteria(lineup, rid, toSortObject(new_)), {
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
export function clueify(lineup:prov.IObjectRef<any>, graph:prov.ProvenanceGraph) {
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

export function untrack(lineup:prov.IObjectRef<any>) {
  return lineup.v.then((value) => Promise.resolve(value.data)).then((p) => {
    p.on(['addRanking.track', 'removeRanking.track'], null);
    p.getRankings().forEach(untrackRanking);
  });
}

