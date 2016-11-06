/**
 * Created by Holger Stitz on 19.08.2016
 */

import './style.scss';

import {IView} from './View';

class LoginFirstView {

  protected $node:d3.Selection<IView>;

  private template = `
  <div class="loginFirstView">
    <!--<img src="/targid2/images/welcome-view-arrow.svg">
    <h1>Login first</h1>-->
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
  return new LoginFirstView(parent, options);
}
