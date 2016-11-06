/**
 * Created by Holger Stitz on 25.05.2016.
 */

/// <amd-dependency path='css!./style' />

import {IView} from './View';

class WelcomeView {

  protected $node:d3.Selection<IView>;

  private template = `
  <div class="welcomeView">
    <img src="/targid2/images/welcome-view-arrow.svg">
    <h1>Start here</h1>
  </div>`;


  constructor(parent:Element, options?) {
    this.$node = d3.select(parent);
    this.build();
  }

  private build() {
    this.$node.html(this.template);
  }
}


export function create(parent:Element, options?) {
  return new WelcomeView(parent, options);
}
