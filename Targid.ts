/**
 * Created by Samuel Gratzl on 29.01.2016.
 */


import C = require('../caleydo_core/main');
import prov = require('../caleydo_clue/prov');
import plugins = require('../caleydo_core/plugin');
import events = require('../caleydo_core/event');
import ranges = require('../caleydo_core/range');
import idtypes = require('../caleydo_core/idtype');
import d3 = require('d3');
import {ViewWrapper, EViewMode, createWrapper, AView} from './View';

export function focusImpl(inputs:prov.IObjectRef<any>[], parameter:any) {
  const targid:Targid = inputs[0].value;

  const index:number = parameter.index;

  return targid.focusImpl(index).then((old) => ({
    inverse: focus(inputs[0], old)
  }));
}

export function createViewImpl(inputs:prov.IObjectRef<any>[], parameter:any, graph:prov.ProvenanceGraph) {
  const targid:Targid = inputs[0].value;
  const viewId:string = parameter.viewId;
  const idtype = parameter.idtype ? idtypes.resolve(parameter.idtype) : null;
  const selection = parameter.selection ? ranges.parse(parameter.selection) : ranges.none();
  const options = parameter.options;

  const view = plugins.get('targidView', viewId);

  var wrapper;
  return createWrapper(graph, { idtype: idtype, range: selection },targid.node, view, options).then((instance) => {
    wrapper = instance;
    return targid.pushImpl(instance);
  }).then((oldFocus) => {
    return {
      created: [wrapper.ref],
      inverse: (inputs, created, removed) => removeView(inputs[0], created[0], oldFocus)
    };
  });
}
export function removeViewImpl(inputs:prov.IObjectRef<any>[], parameter) {
  const targid:Targid = inputs[0].value;
  const view:ViewWrapper = inputs[1].value;
  const oldFocus:number = parameter.focus;

  targid.removeImpl(view, oldFocus);
  return {
    removed: inputs[1],
    inverse: createView(inputs[0], view.desc.id, view.selection.idtype, view.selection.range, view.options)
  };
}
export function replaceViewImpl(inputs:prov.IObjectRef<any>[], parameter, graph:prov.ProvenanceGraph) {
  const targid:Targid = inputs[0].value;
  const view:ViewWrapper = inputs[1].value;
  const viewId:string = parameter.withViewId;
  const idtype = parameter.idtype ? idtypes.resolve(parameter.idtype) : null;
  const selection = parameter.selection ? ranges.parse(parameter.selection) : ranges.none();
  const options = parameter.options;

  const newView = plugins.get('targidView', viewId);

  var wrapper;
  return createWrapper(graph, { idtype: idtype, range: selection },targid.node, newView, options).then((instance) => {
    wrapper = instance;
    return targid.replaceImpl(view, instance);
  }).then((oldFocus) => {
    return {
      created: [prov.ref(wrapper, 'View ' + newView.name, prov.cat.visual)],
      removed: [inputs[1]],
      inverse: (inputs, created, removed) => replaceView(inputs[0], created[0], wrapper.desc.id, wrapper.selection.idtype, wrapper.selection.range, wrapper.options)
    };
  });
}

export function focus(targid:prov.IObjectRef<Targid>, index:number) {
  return prov.action(prov.meta('Focus ' + index, prov.cat.layout), 'targidFocus', focusImpl, [targid], {
    index: index
  });
}

export function createView(targid:prov.IObjectRef<Targid>, viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options?) {
  const view = plugins.get('targidView', viewId);
  //assert view
  return prov.action(prov.meta('Add ' + view.name, prov.cat.visual, prov.op.create), 'targidCreateView', createViewImpl, [targid], {
    viewId: viewId,
    idtype: idtype ? idtype.id : null,
    selection: selection ? selection.toString() : ranges.none().toString(),
    options: options
  });
}
export function removeView(targid:prov.IObjectRef<Targid>, view:prov.IObjectRef<ViewWrapper>, oldFocus = -1) {
  //assert view
  return prov.action(prov.meta('Remove View: ' + view.toString(), prov.cat.visual, prov.op.remove), 'targidRemoveView', removeViewImpl, [targid, view], {
    viewId: view.value.desc.id,
    focus: oldFocus
  });
}
export function replaceView(targid:prov.IObjectRef<Targid>, view:prov.IObjectRef<ViewWrapper>, viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options?) {
  //assert view
  return prov.action(prov.meta('Replace View: ' + view.toString()+' with ' + view.name, prov.cat.visual, prov.op.update), 'targidReplaceView', replaceViewImpl, [targid, view], {
    viewId: view.value.desc.id,
    withViewId: viewId,
    idtype: idtype ? idtype.id : null,
    selection: selection ? selection.toString() : ranges.none().toString(),
    options: options
  });
}

export function createCmd(id):prov.ICmdFunction {
  switch (id) {
    case 'targidFocus':
      return focusImpl;
    case 'targidCreateView':
      return createViewImpl;
    case 'targidRemoveView':
      return removeViewImpl;
    case 'targidReplaceView':
      return replaceViewImpl;
  }
  return null;
}

/**
 * compresses the given path by removing redundant focus operations
 * @param path
 * @returns {prov.ActionNode[]}
 */
export function compressFocus(path:prov.ActionNode[]) {
  var last = null;
  path.forEach((p) => {
    if (p.f_id === 'targidFocus') {
      last = p;
    }
  });
  if (!last) {
    return path;
  }
  return path.filter((p) => {
    return p.f_id !== 'targidFocus' || p === last;
  });
}

export function compressCreateRemove(path:prov.ActionNode[]) {
  var r = [];
  for (let i = 0; i < path.length; ++i) {
    let p = path[i];
    if (p.f_id === 'targidRemoveView' && r.length > 0) {
      let last = r[r.length - 1];
      if (last.f_id === 'targidCreateView' && p.parameter.viewId === last.parameter.viewId) {
        r.pop();
        continue;
      }
    }
    r.push(p);
  }
  return r;
}


export class Targid {
  private views:ViewWrapper[] = [];

  ref:prov.IObjectRef<Targid>;

  private $node:d3.Selection<Targid>;
  private $history:d3.Selection<any>;

  private removeWrapper = (event:any, view:ViewWrapper) => this.remove(view);
  private openWrapper = (event:events.IEvent, viewId:string, idtype:idtypes.IDType, selection:ranges.Range) => this.openRight(<ViewWrapper>event.target, viewId, idtype, selection);
  private updateSelection = (event:events.IEvent, idtype:idtypes.IDType, selection:ranges.Range) => this.updateRight(<ViewWrapper>event.target, idtype, selection);

  constructor(public graph:prov.ProvenanceGraph, parent:Element) {
    this.ref = graph.findOrAddObject(this, 'Targid', prov.cat.visual);

    this.$history = d3.select(parent).insert('div', ':first-child').classed('history', true);
    this.$node = d3.select(parent).insert('div', ':first-child').classed('targid', true).datum(this);
  }

  get node() {
    return <Element>this.$node.node();
  }

  private openRight(view:ViewWrapper, viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options?) {
    if (view === this.views[this.views.length - 1]) { //last one just open
      return this.push(viewId, idtype, selection, options);
    }
    return this.replace(this.views[this.views.length - 1], viewId, idtype, selection, options);
    //remove all to the right and open the new one
    //return this.remove(this.views[this.views.length - 1]).then(() => this.push(viewId, idtype, selection));
  }

  private updateRight(view:ViewWrapper, idtype:idtypes.IDType, selection:ranges.Range) {
    const i = this.views.indexOf(view);
    if (i === (this.views.length - 1)) { //last one no propagation
       return;
    }
    this.views[i+1].setSelection({ idtype: idtype, range: selection});
    //TODO remove all +1
  }

  push(viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options?) {
    return this.graph.push(createView(this.ref, viewId, idtype, selection, options));
  }

  remove(index_or_view:number|ViewWrapper) {
    const view = typeof index_or_view === 'number' ? this.views[<number>index_or_view] : <ViewWrapper>index_or_view;
    const view_ref = this.graph.findObject(view);
    return this.graph.push(removeView(this.ref, view_ref));
  }

  replace(index_or_view:number|ViewWrapper, viewId:string, idtype:idtypes.IDType, selection:ranges.Range, options) {
    const view = typeof index_or_view === 'number' ? this.views[<number>index_or_view] : <ViewWrapper>index_or_view;
    const view_ref = this.graph.findObject(view);
    return this.graph.push(replaceView(this.ref, view_ref, viewId, idtype, selection, options));
  }

  pushImpl(view:ViewWrapper) {
    view.on(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    view.on(ViewWrapper.EVENT_OPEN, this.openWrapper);
    view.on(AView.EVENT_SELECT, this.updateSelection);
    this.views.push(view);
    this.update();
    return C.resolveIn(100).then(() => this.focusImpl(this.views.length - 1));
  }

  removeImpl(view:ViewWrapper, focus:number = -1) {
    const i = this.views.indexOf(view);
    view.off(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    view.off(ViewWrapper.EVENT_OPEN, this.openWrapper);
    view.off(AView.EVENT_SELECT, this.updateSelection);

    this.views.splice(i, 1);
    this.update();
    view.destroy();
    //remove with focus change if not already hidden
    if (!isNaN(focus) && view.mode !== EViewMode.HIDDEN) {
      if (focus < 0) {
        focus = i - 1;
      }
      return this.focusImpl(focus);
    }
    return Promise.resolve(NaN);
  }

  replaceImpl(view:ViewWrapper, withView: ViewWrapper) {
    const i = this.views.indexOf(view);
    view.off(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    view.off(ViewWrapper.EVENT_OPEN, this.openWrapper);
    view.off(AView.EVENT_SELECT, this.updateSelection);

    withView.on(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    withView.on(ViewWrapper.EVENT_OPEN, this.openWrapper);
    withView.on(AView.EVENT_SELECT, this.updateSelection);
    withView.mode = view.mode;

    this.views.splice(i, 1, withView);
    this.update();
    view.destroy();
    return C.resolveIn(100);
  }

  removeLastImpl() {
    return this.removeImpl(this.views[this.views.length - 1]);
  }

  replaceLastImpl(view:ViewWrapper) {
    const old = this.views.pop();
    old.destroy();
    this.pushImpl(view);
  }

  focus(index_or_view:number|ViewWrapper) {
    const index = typeof index_or_view === 'number' ? <number>index_or_view : this.views.indexOf(<ViewWrapper>index_or_view);
    if (this.views[index].mode === EViewMode.FOCUS) {
      return;
    }
    return this.graph.push(focus(this.ref, index));
  }

  focusImpl(index:number) {
    var old = -1;
    this.views.forEach((v, i) => {
      if (v.mode === EViewMode.FOCUS) {
        old = i;
      }
      var target = EViewMode.HIDDEN;
      if (i === index) {
        target = EViewMode.FOCUS;
      } else if (i === (index - 1)) {
        target = EViewMode.CONTEXT;
      }
      v.mode = target;
    });
    if (old === index) {
      return Promise.resolve(old);
    }
    this.update();
    return C.resolveIn(1000).then(() => old);
  }

  private update() {
    const $views = this.$history.selectAll('div.hview').data(this.views);
    $views.enter().append('div').classed('hview', true).on('click', (d) => {
      this.focus(d);
    }).on('contextmenu', (d) => {
      d3.event.preventDefault();
      this.remove(d);
    });
    $views
      .text((d) => d.desc.name)
      .classed('t-context', (d) => d.mode === EViewMode.CONTEXT)
      .classed('t-hide', (d) => d.mode === EViewMode.HIDDEN)
      .classed('t-focus', (d) => d.mode === EViewMode.FOCUS);
    $views.exit().remove();
  }
}

export function create(graph:prov.ProvenanceGraph, parent:Element) {
  return new Targid(graph, parent);
}
