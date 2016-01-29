/**
 * Created by Samuel Gratzl on 29.01.2016.
 */


import C = require('../caleydo_core/main');
import prov = require('../caleydo_provenance/main');
import datatypes = require('../caleydo_core/datatype');
import plugins = require('../caleydo_core/plugin');
import d3 = require('d3');
import {IView} from './AView';
import {EViewMode} from "./AView";

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
  const view = plugins.get('targidView', viewId);

  var instance;
  return view.load().then((plugin) => {
    instance = plugin.factory(graph, targid.node, view);
    return targid.pushImpl(instance);
  }).then((oldFocus) => {
    return {
      created: [ prov.ref(instance, 'View '+view.name, prov.cat.visual) ],
      inverse: (inputs, created, removed) => removeView(inputs[0], created[0], oldFocus)
    }
  });
}
export function removeViewImpl(inputs: prov.IObjectRef<any>[], parameter) {
  const targid : Targid = inputs[0].value;
  const view : IView = inputs[1].value;
  const oldFocus : number = parameter.focus;

  targid.removeImpl(view, oldFocus);
  return {
    inverse: createView(inputs[0], view.desc.id)
  }
}

export function focus(targid:prov.IObjectRef<Targid>, index: number) {
  return prov.action(prov.meta('Focus ' + index, prov.cat.layout), 'targidFocus', focusImpl, [targid], {
    index: index
  });
}

export function createView(targid:prov.IObjectRef<Targid>, viewId: string) {
  const view = plugins.get('targidView', viewId);
  //assert view
  return prov.action(prov.meta('Add ' + view.name, prov.cat.visual, prov.op.create), 'targidCreateView', createViewImpl, [targid], {
    viewId: viewId
  });
}
export function removeView(targid:prov.IObjectRef<Targid>, view: prov.IObjectRef<IView>, oldFocus = -1) {
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


export class Targid {
  private views:IView[] = [];

  ref: prov.IObjectRef<Targid>;

  private $node : d3.Selection<Targid>;

  constructor(private graph: prov.ProvenanceGraph, parent: Element) {
    this.ref = graph.findOrAddObject(this, 'Targid', prov.cat.visual);
    this.$node = d3.select(parent).insert('div',':first-child').classed('targid', true).datum(this);
  }

  get node() {
    return <Element>this.$node.node();
  }

  push(viewId: string) {
    return this.graph.push(createView(this.ref, viewId));
  }

  remove(index: number) {
    const view = this.graph.findObject(this.views[index]);
    return this.graph.push(removeView(this.ref, view));
  }

  pushImpl(view: IView) {
    this.views.push(view);
    return C.resolveIn(100).then(() => this.focusImpl(this.views.length-1));
  }

  removeImpl(view: IView, focus?: number) {
    const i = this.views.indexOf(view);
    this.views.splice(i, 1);
    if (typeof focus === 'undefined') {
      focus = i - 1;
    }
    view.destroy();
    return this.focusImpl(focus);
  }

  removeLastImpl() {
    return this.removeImpl(this.views[this.views.length-1]);
  }

  replaceLastImpl(view: IView) {
    const old = this.views.pop();
    old.destroy();
    this.pushImpl(view);
  }

  setInFocus(view: IView) {
    this.focus(this.views.indexOf(view));
  }

  focus(index: number) {
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
    return C.resolveIn(1000).then(() => old);
  }
}

export function create(graph : prov.ProvenanceGraph, parent: Element) {
  return new Targid(graph, parent);
}
