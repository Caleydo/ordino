/**
 * Created by Holger Stitz on 27.07.2016.
 */

import {IPluginDesc} from '../caleydo_core/plugin';
import session = require('../caleydo_core/session');
import dialogs = require('../caleydo_bootstrap_fontawesome/dialogs');

export function createStartFactory(parent: HTMLElement, desc: IPluginDesc, options:any) {
  const targid = options.targid;
  const format = d3.time.format.utc('%Y-%m-%d %H:%M');

  const template = `<table class="table table-striped table-hover table-bordered">
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

  const $parent = d3.select(parent).html(`
    <div class="loading">
      <i class="fa fa-spinner fa-pulse fa-fw"></i>
      <span class="sr-only">Loading...</span>
    </div>`);

  targid.graphManager.list().then((list:any[]) => {
    const $table = $parent.html(template);
    const $list = $table.select('tbody')
      .classed('loading', false)
      .selectAll('tr').data(list);

    const $tr_enter = $list.enter().append('tr');
    //$tr_enter.append('td').text((d) => 'Unknown');
    $tr_enter.append('td').text((d) => d.name);
    //$tr_enter.append('td').html((d) => d.description ? d.description : '<i>(none)</i>');
    $tr_enter.append('td').text((d) => d.ts ? format(new Date(d.ts)) : 'Unknown');
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
          targid.graphManager.delete(d);
        }
      });
    });
    $tr_enter.select('button[data-action="clone"]').on('click', (d) => {
      targid.graphManager.loadOrClone(d, false);
      return false;
    });
    $tr_enter.select('button[data-action="select"]').on('click', (d) => {
      targid.graphManager.loadOrClone(d, true);
      return false;
    });
  });

}
