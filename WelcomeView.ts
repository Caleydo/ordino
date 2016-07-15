/**
 * Created by Holger Stitz on 25.05.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import prov = require('../caleydo_clue/prov');

import {AView, IViewContext, ISelection, findStartViewCreators} from './View';
import {Targid} from './Targid';

export class WelcomeView extends AView {

  private graph:prov.ProvenanceGraph;
  private targid:Targid;

  private template = `
  <div style="position:absolute;top: 10px;left:20px;z-index: 1;">
    <img src="/targid2/images/welcome-view-arrow.svg" style="width: 300px; height: auto; opacity: 0.2">
    <h1 style="position: absolute; left: 150px; margin: 0; padding: 0;width: 400px; color: #999; font-size: 4em;">Start here</h1>
  </div>`;


  constructor(context:IViewContext, private selection: ISelection, parent:Element, options?) {
    super(context, parent, options);

    this.targid = options.targid;
    this.graph = options.graph;

    this.build();
    this.update();
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    // hook
  }

  getParameter(name: string): any {
    return;
  }

  setParameter(name: string, value: any) {
    return this.update();
  }

  private build() {
    let $body = this.$node.append('div').html(this.template);
  }

  changeSelection(selection:ISelection) {
    this.selection = selection;
    return this.update();
  }

  private update() {
    // implement
  }
}


export function create(context:IViewContext, selection:ISelection, parent:Element, options?) {
  return new WelcomeView(context, selection, parent, options);
}
