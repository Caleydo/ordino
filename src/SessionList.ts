/**
 * Created by Holger Stitz on 27.07.2016.
 */

import * as session from 'phovea_core/src/session';
import {areyousure} from 'phovea_ui/src/dialogs';
import {IPluginDesc} from 'phovea_core/src/plugin';
import {IStartMenuSectionEntry, IStartMenuOptions} from './StartMenu';
import {Targid} from './Targid';
import {select} from 'd3';


function isLoggedIn() {
  return session.retrieve('logged_in', <boolean>false);
}

class SessionList implements IStartMenuSectionEntry {

  //private format = d3.time.format.utc('%Y-%m-%d %H:%M');

  private static readonly TEMPLATE = `<table class="table table-striped table-hover table-bordered table-condensed">
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


  private readonly targid:Targid;

  /**
   * Set the idType and the default data and build the list
   * @param parent
   * @param desc
   * @param options
   */
  constructor(private readonly parent: HTMLElement, public readonly desc: IPluginDesc, private readonly options:IStartMenuOptions) {
    this.targid = options.targid;
    this.build();
  }

  getEntryPointLists() {
    return [];
  }

  private async build() {
    const $parent = select(this.parent).classed('menuTable', true).html(`
      <div class="loading">
        <i class="fa fa-spinner fa-pulse fa-fw"></i>
        <span class="sr-only">Loading...</span>
      </div>`);

    let list = await this.targid.graphManager.list();
    list = list
      // filter local workspaces, since we are using remote storage
      .filter((d) => d.local === false || d.local === undefined)
      // filter list by username
      .filter((d) => d.creator === session.retrieve('username'));

    //sort by date desc
    list = list.sort((a, b) => -((a.ts || 0) - (b.ts || 0)));

    const $table = $parent.html(SessionList.TEMPLATE);

    const $list = $table.select('tbody')
      .classed('loading', false)
      .selectAll('tr').data(list);

    const $trEnter = $list.enter().append('tr').attr('id',(d) => d.id);
    //$tr_enter.append('td').text((d) => 'Unknown');
    $trEnter.append('td').text((d) => d.name);
    //$tr_enter.append('td').html((d) => d.description ? d.description : '<i>(none)</i>');
    $trEnter.append('td').text((d) => d.ts ? new Date(d.ts).toUTCString() : 'Unknown');
    $trEnter.append('td').text((d) => d.creator);
    //$tr_enter.append('td').text((d) => `${d.size[0]} / ${d.size[1]}`);
    $trEnter.append('td').html((d) => {
      return `<button class="btn btn-xs btn-default" data-action="select" ${!isLoggedIn() && !d.local ? 'disabled="disabled"' : ''}><span class="fa fa-folder-open" aria-hidden="true"></span> Select</button>
      <button class="btn btn-xs btn-default" data-action="clone"><span class="fa fa-clone" aria-hidden="true"></span> Clone</button>
      <button class="btn btn-xs btn-default" data-action="delete" ${!isLoggedIn() && !d.local ? 'disabled="disabled"' : ''}><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>`;
    });

    $trEnter.select('button[data-action="delete"]').on('click', async (d) => {
      const deleteIt = await areyousure('Are you sure to delete: "' + d.name + '"');
      if (deleteIt) {
        this.targid.graphManager.delete(d);
        $table.selectAll('#'+d.id).remove();
      }
    });
    $trEnter.select('button[data-action="clone"]').on('click', (d) => {
      this.targid.graphManager.loadOrClone(d, false);
      return false;
    });
    $trEnter.select('button[data-action="select"]').on('click', (d) => {
      this.targid.graphManager.loadOrClone(d, true);
      return false;
    });
  }
}

export function create(parent: HTMLElement, desc: IPluginDesc, options:IStartMenuOptions) {
  return new SessionList(parent, desc, options);
}
