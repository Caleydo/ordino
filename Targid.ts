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
import {ViewWrapper, EViewMode, createWrapper, createContext} from './View';

export function focusImpl(inputs: prov.IObjectRef<any>[], parameter: any) {
  const targid : Targid = inputs[0].value;

  const index: number = parameter.index;

  return targid.focusImpl(index).then((old) => ({
    inverse: focus(inputs[0], old)
  }));
}

export function createViewImpl(inputs: prov.IObjectRef<any>[], parameter: any, graph: prov.ProvenanceGraph) {
  const targid : Targid = inputs[0].value;
  const viewId: string = parameter.viewId;
  const idtype = parameter.idtype ? idtypes.resolve(parameter.idtype): null;
  const selection = parameter.selection ? ranges.parse(parameter.selection): ranges.none();

  const view = plugins.get('targidView', viewId);

  var wrapper;
  return createWrapper(createContext(graph, idtype, selection), targid.node, view).then((instance) => {
    wrapper = instance;
    return targid.pushImpl(instance);
  }).then((oldFocus) => {
    return {
      created: [ prov.ref(wrapper, 'View '+view.name, prov.cat.visual) ],
      inverse: (inputs, created, removed) => removeView(inputs[0], created[0], oldFocus)
    };
  });
}
export function removeViewImpl(inputs: prov.IObjectRef<any>[], parameter) {
  const targid : Targid = inputs[0].value;
  const view : ViewWrapper = inputs[1].value;
  const oldFocus : number = parameter.focus;

  targid.removeImpl(view, oldFocus);
  return {
    inverse: createView(inputs[0], view.desc.id, view.context.idtype, view.context.selection)
  };
}

export function focus(targid:prov.IObjectRef<Targid>, index: number) {
  return prov.action(prov.meta('Focus ' + index, prov.cat.layout), 'targidFocus', focusImpl, [targid], {
    index: index
  });
}

export function createView(targid:prov.IObjectRef<Targid>, viewId: string, idtype: idtypes.IDType, selection: ranges.Range) {
  const view = plugins.get('targidView', viewId);
  //assert view
  return prov.action(prov.meta('Add ' + view.name, prov.cat.visual, prov.op.create), 'targidCreateView', createViewImpl, [targid], {
    viewId: viewId,
    idtype: idtype ? idtype.id : null,
    selection: selection ? selection.toString() : ranges.none().toString()
  });
}
export function removeView(targid:prov.IObjectRef<Targid>, view: prov.IObjectRef<ViewWrapper>, oldFocus = -1) {
  //assert view
  return prov.action(prov.meta('Remove View: '+view.toString(), prov.cat.visual, prov.op.remove), 'targidRemoveView', removeViewImpl, [targid, view], {
    focus: oldFocus
  });
}

export function createCmd(id): prov.ICmdFunction {
  switch (id) {
    case 'targidFocus':
      return focusImpl;
    case 'targidCreateView':
      return createViewImpl;
    case 'targidRemoveView':
      return removeViewImpl;
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


export class Targid {
  private views:ViewWrapper[] = [];

  ref: prov.IObjectRef<Targid>;

  private $node : d3.Selection<Targid>;
  private $history: d3.Selection<any>;

  private removeWrapper = (event: any, view: ViewWrapper) => this.remove(view);
  private openWrapper = (event: events.IEvent, viewId: string, idtype: idtypes.IDType, selection: ranges.Range) => this.openRight(<ViewWrapper>event.target, viewId, idtype, selection);

  constructor(public graph: prov.ProvenanceGraph, parent: Element) {
    this.ref = graph.findOrAddObject(this, 'Targid', prov.cat.visual);

    this.$history = d3.select(parent).insert('div',':first-child').classed('history', true);
    this.$node = d3.select(parent).insert('div',':first-child').classed('targid', true).datum(this);
  }

  get node() {
    return <Element>this.$node.node();
  }

  private openRight(view: ViewWrapper, viewId: string, idtype: idtypes.IDType, selection: ranges.Range) {
    if (view === this.views[this.views.length-1]) { //last one just open
      return this.push(viewId, idtype, selection);
    }
    //remove all to the right and open the new one
    return this.remove(this.views[this.views.length-1]).then(() => this.push(viewId, idtype, selection));
  }

  push(viewId: string, idtype: idtypes.IDType, selection: ranges.Range) {
    return this.graph.push(createView(this.ref, viewId, idtype, selection));
  }

  remove(index_or_view: number|ViewWrapper) {
    const view = typeof index_or_view === 'number' ? this.views[<number>index_or_view] : <ViewWrapper>index_or_view;
    const view_ref = this.graph.findObject(view);
    return this.graph.push(removeView(this.ref, view_ref));
  }

  pushImpl(view: ViewWrapper) {
    view.on(ViewWrapper.EVENT_REMOVE, this.removeWrapper);
    view.on(ViewWrapper.EVENT_OPEN, this.openWrapper);
    this.views.push(view);
    this.update();
    return C.resolveIn(100).then(() => this.focusImpl(this.views.length-1));
  }

  removeImpl(view: ViewWrapper, focus: number = -1) {
    const i = this.views.indexOf(view);
    view.off('remove', this.removeWrapper);
    view.off('open', this.openWrapper);

    this.views.splice(i, 1);
    this.update();
    if (focus < 0) {
      focus = i - 1;
    }
    view.destroy();
    return this.focusImpl(focus);
  }

  removeLastImpl() {
    return this.removeImpl(this.views[this.views.length-1]);
  }

  replaceLastImpl(view: ViewWrapper) {
    const old = this.views.pop();
    old.destroy();
    this.pushImpl(view);
  }

  focus(index_or_view: number|ViewWrapper) {
    const index = typeof index_or_view === 'number' ? <number>index_or_view : this.views.indexOf(<ViewWrapper>index_or_view);
    return this.graph.push(focus(this.ref, index));
  }

  focusImpl(index: number) {
    var old = -1;
    this.views.forEach((v, i) => {
      if (v.mode === EViewMode.FOCUS) {
        old = i;
      }
      var target = EViewMode.HIDDEN;
      if (i === index) {
        target = EViewMode.FOCUS;
      } else if (i === (index-1)) {
        target = EViewMode.CONTEXT;
      }
      v.mode = target;
    });
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

export function create(graph : prov.ProvenanceGraph, parent: Element) {
  return new Targid(graph, parent);
}
