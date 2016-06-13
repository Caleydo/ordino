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
  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="before"><a href="#tab_upload" aria-controls="tab_upload" role="tab" data-toggle="tab">Upload</a></li>
    <li role="presentation"><a href="#tab_continue" aria-controls="tab_continue" role="tab" data-toggle="tab">Continue</a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane before" id="tab_upload">
      <p><span class="label label-default">TODO</span>Integrate importer</p>
    </div>
    <div role="tabpanel" class="tab-pane" id="tab_continue">
      <table class="table">
        <thead>
          <tr>
            <th>Entity Type</th>
            <th>Name</th>
            <th>Date</th>
            <th>Creator</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
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
    this.$node.append('h1').text('Welcome to the Target Discovery Platform');

    let $body = this.$node.append('div').html(this.template);

    const view = findStartViewCreators();

    // create tabs
    const $views = $body.select('ul.nav').selectAll('li.view').data(view);
    $views.enter().insert('li','.before').attr({
      role: 'presentation',
      'class': (d, i) => (i === 0 ? ' active' : '') + ' view'
    }).html((d,i) => `<a href="#tab_view${i}" aria-controls="tab_old" role="tab" data-toggle="tab">${d.name}</a>`);

    // create tab pane
    const $views2 = $body.select('div.tab-content').selectAll('div.tab-pane.view').data(view);
    const $views2_enter = $views2.enter().insert('div','.before').attr({
      role: 'tabpanel',
      'class': (d, i) => (i === 0 ? ' active' : '') + ' tab-pane',
      id: (d,i) => `tab_view${i}`
    }).html(`<div></div><button class="btn btn-primary">Start</button>`);
    $views2_enter.select('div').each(function(d) {
      d.build(this);
    });
    $views2_enter.select('button:last-of-type').on('click', (d) => {
      d.options().then((o) => {
        this.targid.push(o.viewId, null, null, o.options);
      });
    });
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
