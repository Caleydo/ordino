/**
 * Created by Holger Stitz on 27.07.2016.
 */

import * as session from 'phovea_core/src/session';
import * as dialogs from 'phovea_bootstrap_fontawesome/src/dialogs';
import {IPluginDesc} from 'phovea_core/src/plugin';
import {IStartMenuSectionEntry} from './StartMenu';
import {Targid} from './Targid';
import {select} from 'd3';

class SessionList implements IStartMenuSectionEntry {

  private targid:Targid;
  //private format = d3.time.format.utc('%Y-%m-%d %H:%M');

  private template = `<table class="table table-striped table-hover table-bordered">
    <thead>
      <tr>
        <!--<th>Entity Type</th>-->
        <th>Name</th>
        <!--<th>Description</th>-->
        <th>Date</th>
        <th>Creator</th>
        <!--<th>Size (Nodes / Edges)</th>-->
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>

    </tbody>
  </table>`;

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

  private build() {
    const $parent = select(this.parent).classed('menuTable', true).html(`
      <div class="loading">
        <i class="fa fa-spinner fa-pulse fa-fw"></i>
        <span class="sr-only">Loading...</span>
      </div>`);

    this.targid.graphManager.list().then((list:any[]) => {

      // filter local workspaces, since we are using remote storage
      list = list.filter((d) => d.local === false || d.local === undefined);

      const $table = $parent.html(this.template);
      const $list = $table.select('tbody')
        .classed('loading', false)
        .selectAll('tr').data(list);

      const $tr_enter = $list.enter().append('tr').attr('id',(d) => d.id);
      //$tr_enter.append('td').text((d) => 'Unknown');
      $tr_enter.append('td').text((d) => d.name);
      //$tr_enter.append('td').html((d) => d.description ? d.description : '<i>(none)</i>');
      $tr_enter.append('td').text((d) => d.ts ? new Date(d.ts).toUTCString() : 'Unknown');
      $tr_enter.append('td').text((d) => d.creator);
      //$tr_enter.append('td').text((d) => `${d.size[0]} / ${d.size[1]}`);
      $tr_enter.append('td').html((d) => {
        return `<button class="btn btn-sm btn-default" data-action="select" ${session.retrieve('logged_in', false) !== true && !d.local ? 'disabled="disabled"' : ''}><span class="fa fa-folder-open" aria-hidden="true"></span> Select</button>
        <button class="btn btn-sm btn-default" data-action="clone"><span class="fa fa-clone" aria-hidden="true"></span> Clone</button>
        <button class="btn btn-sm btn-default" data-action="delete" ${session.retrieve('logged_in', false) !== true && !d.local ? 'disabled="disabled"' : ''}><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>`;
      });

      $tr_enter.select('button[data-action="delete"]').on('click', (d) => {
        dialogs.areyousure('Are you sure to delete: "' + d.name + '"').then((deleteIt) => {
          if (deleteIt) {
            this.targid.graphManager.delete(d);
            $table.selectAll('#'+d.id).remove();
          }
        });
      });
      $tr_enter.select('button[data-action="clone"]').on('click', (d) => {
        this.targid.graphManager.loadOrClone(d, false);
        return false;
      });
      $tr_enter.select('button[data-action="select"]').on('click', (d) => {
        this.targid.graphManager.loadOrClone(d, true);
        return false;
      });
    });
  }
}

export function createStartFactory(parent: HTMLElement, desc: IPluginDesc, options:any) {
  return new SessionList(parent, desc, options);
}
