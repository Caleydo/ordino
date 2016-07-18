/**
 * Created by Holger Stitz on 25.05.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import prov = require('../caleydo_clue/prov');

import {AView, IViewContext, ISelection, findStartViewCreators, IView} from './View';

export class WelcomeView {//extends AView {

  protected $node:d3.Selection<IView>;

  private template = `
  <div style="position:absolute;top: 10px;left:20px;z-index: 1;">
    <img src="/targid2/images/welcome-view-arrow.svg" style="width: 300px; height: auto; opacity: 0.2">
    <h1 style="position: absolute; left: 150px; margin: 0; padding: 0;width: 400px; color: #999; font-size: 4em;">Start here</h1>
  </div>`;


  constructor(parent:Element, options?) {
    this.$node = d3.select(parent);
    this.build();
  }

  private build() {
    this.$node.append('div').html(this.template);
  }
}


export function create(parent:Element, options?) {
  return new WelcomeView(parent, options);
}
