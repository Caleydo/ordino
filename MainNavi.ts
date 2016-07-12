/**
 * Created by Holger Stitz on 12.07.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import prov = require('../caleydo_clue/prov');

import {ISelection, findStartViewCreators, IView} from './View';
import {Targid} from './Targid';

export class MainNavi {

  protected $node:d3.Selection<IView>;

  private targid:Targid;

  private template = `
  <ul>
    <li>
      <a href="#">
        <i class="fa fa-home" aria-hidden="true"></i>
        <span class="sr-only">Start</span>
      </a>
    </li>
    <li class="divider">BioInfoDB</li>
    <li>
      <button class="btn btn-default btn-lg">
        <span aria-hidden="true">Ti</span>
        <span class="sr-only">Tissues</span>
      </button>
      <div class="panel panel-default">
        <div class="panel-heading">Tissues</div>
        <div class="panel-body">
          <ul>
            <li><a href="#">All</a></li>
            <li><a href="#">Human</a></li>
          </ul>
        </div>
      </div>
    </li>
    <li class="divider">CellLineDB</li>
    <li>
      <button class="btn btn-default btn-lg">
        <span aria-hidden="true">Ge</span>
        <span class="sr-only">Genes</span>
      </button>
      <div class="panel panel-default">
        <div class="panel-heading">Genes</div>
        <div class="panel-body">
          <ul>
            <li><a href="#">All</a></li>
            <li><a href="#">Homo_sapiens</a></li>
            <li><a href="#">Test</a></li>
          </ul>
        </div>
      </div>
    </li>
    <li>
      <button class="btn btn-default btn-lg">
        <span aria-hidden="true">Ce</span>
        <span class="sr-only">CellLines</span>
      </button>
      <div class="panel panel-default">
        <div class="panel-heading">CellLines</div>
        <div class="panel-body">
          <ul>
            <li><a href="#">All</a></li>
            <li><a href="#">Human</a></li>
            <li><a href="#">Mouse</a></li>
            <li><a href="#">Rat</a></li>
            <li><a href="#">Male</a></li>
            <li><a href="#">Test Celline</a></li>
          </ul>
        </div>
      </div>
    </li>
    <li class="divider"></li>
    <li>
      <button class="btn btn-default btn-lg">
        <span aria-hidden="true">Du</span>
        <span class="sr-only">Dummy A</span>
      </button>
      <div class="panel panel-default">
        <div class="panel-heading">Dummy A</div>
        <div class="panel-body">
          <ul>
            <li><a href="#">All</a></li>
            <li><a href="#">ACat 1</a></li>
            <li><a href="#">ACat 2</a></li>
            <li><a href="#">ACat 3</a></li>
          </ul>
        </div>
      </div>
    </li>
    <li>
      <button class="btn btn-default btn-lg">
        <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>
        <span class="sr-only">Load Stored LineUp4BI</span>
      </button>
      <div class="panel panel-default">
        <div class="panel-heading">Load Stored LineUp4BI</div>
        <div class="panel-body">
          <span>Do not forget to login!</span><br>
          <button class="btn btn-default btn-xs">Refresh</button>
        </div>
      </div>
    </li>
    <li>
      <button class="btn btn-default btn-lg">
        <i class="fa fa-upload" aria-hidden="true"></i>
        <span class="sr-only">Upload Data</span>
      </button>
      <div class="panel panel-default">
        <div class="panel-heading">Upload Data</div>
        <div class="panel-body"><p><span class="label label-default">TODO</span> Integrate importer</p></div>
      </div>
    </li>
    <li>
      <button class="btn btn-default btn-lg">
        <i class="fa fa-play" aria-hidden="true"></i>
        <span class="sr-only">Continue Session</span>
      </button>
      <div class="panel panel-default">
        <div class="panel-heading">Continue Session</div>
        <div class="panel-body">
          <table class="table" style="min-width:500px;">
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
      </div>
    </li>
  </ul>`;

  private template_old = `
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

  constructor(private selection: ISelection, parent:Element, options?) {
    this.$node = d3.select(parent);
    this.targid = options.targid;
    this.build();
  }

  private build() {
    let $body = this.$node.html(this.template);

    /*const view = findStartViewCreators();

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
    });*/
  }
}

export function create(selection:ISelection, parent:Element, options?) {
  return new MainNavi(selection, parent, options);
}
