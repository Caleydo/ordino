/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="./tsd.d.ts" />

import d3 = require('d3');
import idtypes = require('../caleydo_core/idtype');
import datas = require('../caleydo_core/data');
import session = require('../caleydo_core/session');
import targidSession = require('../targid2/TargidSession');
import {IViewContext, ISelection} from '../targid2/View';
import {ALineUpView, useDefaultLayout,} from '../targid2/LineUpView';
import {IPluginDesc} from '../caleydo_core/plugin';
import {TargidConstants, Targid} from '../targid2/Targid';
import {IStartMenuSectionEntry} from './StartMenu';
import {create as createImporter} from '../lineup4bi/uploader';
import {upload as uploadData} from '../caleydo_core/data';
import {showErrorModalDialog} from './Dialogs';

class StoredLineUp extends ALineUpView {
  private dataId: string;
  private dataIDType: string;

  constructor(context:IViewContext, selection: ISelection, parent:Element, options?) {
    super(context, parent, options);
    this.dataId = options && (typeof options.dataId !== 'undefined') ? options.dataId : null;
    this.dataIDType = options && options.dataIDType ? options.dataIDType : null;
    //TODO
    this.build();
  }

  private build() {
    if (this.dataId !== null) {
      //generate random data
      this.setBusy(true);
      datas.get(this.dataId).then((d:any) => {
        const idType = d.desc.idType || this.dataIDType || 'Custom';
        return d.data().then((data) => {
          //const colId = data.columns[0].column;
          var accessor = null;
          if (data.ids) {
            //we have the ids, merge them into the data
            data.data.forEach((d: any,i) => d._id = data.ids[i]);
            accessor = (d) => d._id;
          }
          const lineup = this.buildLineUp(data.data, data.columns, idtypes.resolve(idType), accessor);
          useDefaultLayout(lineup);
          lineup.update();
          this.initializedLineUp();
        });
      });
    }
  }
}

export function create(context:IViewContext, selection: ISelection, parent:Element, options?) {
  return new StoredLineUp(context, selection, parent, options);
}


class StoredLineUpStartList implements IStartMenuSectionEntry {

  private targid:Targid;

  /**
   * Set the idType and the default data and build the list
   * @param parent
   * @param desc
   * @param options
   */
  constructor(protected parent: HTMLElement, public desc: IPluginDesc, protected options:any) {
    this.targid = options.targid;
    this.build();
  }

  private selectFile(d: any) {
    // if targid object is available
    if(this.targid) {
      // create options for new view
      let o = { dataId: d.desc.id };

      // store state to session before creating a new graph
      targidSession.store(TargidConstants.NEW_ENTRY_POINT, {
        view: (<any>this.desc).viewId,
        options: o
      });

      // create new graph and apply new view after window.reload (@see targid.checkForNewEntryPoint())
      this.targid.graphManager.newGraph();
    } else {
      console.error('no targid object given to push new view');
    }
  }

  private build() {
    const that = this;
    const $parent = d3.select(this.parent);

    $parent.html(''); // remove loading element
    createImporter(<Element>($parent.append('div').classed('uploader',true).node()), upload);

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
            that.selectFile(d);
          });
      });
    }

    function upload(desc: any, rows: any[][]) {
      var cols = desc.columns;
      delete desc.columns;
      var s = {
        type: 'lineup_data_v2',
        desc: desc,
        columns: cols,
        data: rows
      };
      uploadData(s).then(function (dataset) {
        that.selectFile(dataset);
        update();
      }).catch(showErrorModalDialog)
        .catch(function (req) {
        //TODO
      });
    }

    $hint.append('button').attr('class', 'btn btn-default btn-xs').text('Check again').on('click', update);

    update();
  }
}


export function createLoadStartFactory(parent: HTMLElement, desc: IPluginDesc, options:any) {
  return new StoredLineUpStartList(parent, desc, options);
}


