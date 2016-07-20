/**
 * Created by Holger Stitz on 12.07.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />

import {findStartViewCreators, IView} from './View';
import {Targid} from './Targid';

export class MainNavi {

  protected $node:d3.Selection<IView>;

  private targid:Targid;

  private templateUploadAndContinue = `
    <ul>
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

  constructor(parent:Element, options?) {
    this.$node = d3.select(parent);
    this.targid = options.targid;
    this.build();
  }

  /**
   * Build multiple sections with entries grouped by database
   */
  private build() {
    // get start views
    const view = findStartViewCreators();

    // nest and group entries by database
    const data = d3.nest().key((d:any) => {
      let cat = d.name.split(' ')[0];
      return (cat.toLowerCase().indexOf('db') > -1) ? cat : 'Other';
    }).entries(view);

    const $cats = this.$node.selectAll('div.cat').data(data);
    const $cat = $cats.enter().append('div').classed('cat', true);
    $cat.append('span').text((d) => d.key);
    const $ul = $cat.append('ul');
    const $lis = $ul.selectAll('li').data((d) => d.values);
    const $lis_enter = $lis.enter().append('li').html((d:any) => {

      let name = d.name.split(' ');
      if(name[0].toLowerCase().indexOf('db') > -1) {
        name.shift();
      }
      name = name.join(' ');

      var r = `<button class="btn btn-default btn-lg">`;
      // use font awesome icon
      if(d.p['fa-icon']) {
        r += `<i class="fa ${d.p['fa-icon']}" aria-hidden="true"></i>`;
      // otherwise use the first two letters of the entry
      } else {
        r += `<span aria-hidden="true">${name.substring(0,2)}</span>`;
      }
      r +=`<span class="sr-only">${name}</span>
        </button>
        <div class="panel panel-default">
          <div class="panel-heading">${name}</div>
          <div class="panel-body"><!-- Insert view here--></div>
        </div>`;
      return r;
    });

    // insert view`s html dynamically to panel body
    const that = this;
    $lis_enter
      .select('div.panel-body')
      .each(function (d:any) {
        // provide targid object as option object
        d.build(this, {targid: that.targid});//.then(() => { console.log(arguments); });
      });

    // append last template
    this.$node.append('div').html(this.templateUploadAndContinue);
  }
}

export function create(parent:Element, options?) {
  return new MainNavi(parent, options);
}
