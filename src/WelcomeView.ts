/**
 * Created by Holger Stitz on 25.05.2016.
 */

import './style.scss';
import * as welcomeArrow from 'url-loader!./images/welcome-view-arrow.svg';
import {IView} from './View';
import {select, Selection} from 'd3';

const template = `
  <div class="welcomeView">
    <img src="${welcomeArrow}">
    <h1>Start here</h1>
  </div>`;

class WelcomeView {

  protected $node:Selection<IView>;

  constructor(parent:Element, options?) {
    this.$node = select(parent);
    this.build();
  }

  private build() {
    this.$node.html(template);
  }
}


export function create(parent:Element, options?) {
  return new WelcomeView(parent, options);
}
