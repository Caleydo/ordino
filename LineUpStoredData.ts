/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="./tsd.d.ts" />

import d3 = require('d3');
import idtypes = require('../caleydo_core/idtype');
import datas = require('../caleydo_core/data');
import session = require('../caleydo_core/session');
import {IViewContext, ISelection} from '../targid2/View';
import {ALineUpView, useDefaultLayout,} from '../targid2/LineUpView';
import {IPluginDesc} from "../caleydo_core/plugin";

export class StoredLineUp extends ALineUpView {
  private dataId: string;
  private dataIDType: string;

  constructor(context:IViewContext, selection: ISelection, parent:Element, options?) {
    super(context, parent, options);
    this.dataId = options && (typeof options.dataId !== 'undefined') ? options.dataId : null;
    this.dataIDType = options && options.dataIDType ? options.dataId : 'custom';
    //TODO
    this.build();
  }

  private build() {
    if (this.dataId !== null) {
      //generate random data
      this.setBusy(true);
      datas.get(this.dataId).then((d:any) => {
        return d.data().then((data) => {
          //const colId = data.columns[0].column;
          const l = this.buildLineUp(data.data, data.columns, idtypes.resolve(this.dataIDType), null);
          useDefaultLayout(l);
          this.initializedLineUp();
          this.setBusy(false);
        });
      });
    }
  }
}

/*export function createLoadStartFactory(parent: HTMLElement) {
  const $parent = d3.select(parent);
  var current = null;
  function update() {
    datas.list({ type: 'lineup_data'} ).then((items: any[]) => {
      const $options = $parent.selectAll('div.radio').data(items);
      $options.enter().append('div').classed('radio', true);
      $options.html((d,i) => `<label><input type="radio" name="loadedDataSet" value="${d.desc.name}" ${i === 0 ? 'checked' : ''}>${d.desc.name}</label>`)
        .select('input').on('change', (d) => current = d);
      $options.exit().remove();
    });
  }
  $parent.append('span').html('Don\'t forget to login!<br>');
  $parent.append('button').attr('class', 'btn btn-default btn-xs').text('Refresh').on('click', update);
  update();

  function buildOptions(): any {
    if (current === null) {
      return {};
    }
    return {
      dataId: current.desc.id
    };
  }
  return () => buildOptions();
}*/

export function createLoadStartFactory(parent: HTMLElement, desc: IPluginDesc, options:any) {
  const $parent = d3.select(parent);
  const $ul = $parent.append('ul');
  const $hint = $parent.append('div');//.attr('style', 'margin-top: 25px; margin-bottom: -10px;');

  function update() {
    if(session.retrieve('logged_in') === true) {
      $hint.select('p').remove();
      $hint.select('button').text('Update list');

    } else if($hint.selectAll('p').size() === 0) {
      $hint.insert('p', ':first-child').text('Please login first.');
      $hint.select('button').text('Check again');

    }

    // load named sets (stored LineUp sessions)
    datas.list({ type: 'lineup_data'} ).then((items: any[]) => {
      // append the list items
      const $options = $ul.selectAll('li').data(items);
      $options.enter()
        .append('li')
        //.classed('selected', (d,i) => (i === 0))
        .append('a')
        .attr('href', '#')
        .text((d:any) => d.desc.name)
        .on('click', (d:any) => {
          // prevent changing the hash (href)
          (<Event>d3.event).preventDefault();

          // if targid object is available
          if(options.targid) {
            // create options for new view
            let o = { dataId: d.desc.id };
            // push new view with options to targid
            options.targid.push((<any>desc).viewId, null, null, o);
          } else {
            console.error('no targid object given to push new view');
          }
        });
    });
    return ():any => {};
  }

  $hint.append('button').attr('class', 'btn btn-default btn-xs').text('Check again').on('click', update);

  return update();
}



export function create(context:IViewContext, selection: ISelection, parent:Element, options?) {
  return new StoredLineUp(context, selection, parent, options);
}


