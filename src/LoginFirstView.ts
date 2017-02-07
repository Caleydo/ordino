/**
 * Created by Holger Stitz on 19.08.2016
 */

import './style.scss';
import {IView} from './View';
import {select, Selection} from 'd3';

class LoginFirstView {

  protected $node:Selection<IView>;

  private template = `
  <div class="loginFirstView">
    <!--<img src="/ordino/images/welcome-view-arrow.svg">
    <h1>Login first</h1>-->
  </div>`;


  constructor(parent:Element, options?) {
    this.$node = select(parent);
    this.build();
  }

  private build() {
    this.$node.html(this.template);
  }
}


export function create(parent:Element, options?) {
  return new LoginFirstView(parent, options);
}
