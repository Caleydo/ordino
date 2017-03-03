/**
 * Created by Holger Stitz on 27.07.2016.
 */

import * as session from 'phovea_core/src/session';
import {areyousure} from 'phovea_ui/src/dialogs';
import {IPluginDesc} from 'phovea_core/src/plugin';
import {IStartMenuSectionEntry, IStartMenuOptions} from './StartMenu';
import {select} from 'd3';
import {isLoggedIn} from 'phovea_clue/src/user';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {IProvenanceGraphDataDescription} from 'phovea_core/src/provenance';

enum ESessionListMode {
  TEMPORARY, MY, PUBLIC_ONES
}

function toMode(mode: string) {
  switch (mode || 'my') {
    case 'temporary':
      return ESessionListMode.TEMPORARY;
    case 'public':
      return ESessionListMode.PUBLIC_ONES;
    default:
      return ESessionListMode.MY;
  }
}

class SessionList implements IStartMenuSectionEntry {

  private static readonly TEMPLATE = `<table class="table table-striped table-hover table-bordered table-condensed">
    <thead>
      <tr>
        <th>Name</th>
        <th>Date</th>
        <th>Creator</th>
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
  constructor(private readonly parent: HTMLElement, public readonly desc: IPluginDesc, private readonly options: IStartMenuOptions) {
    this.build(options.targid.graphManager, toMode(desc.mode));
  }

  getEntryPointLists() {
    return [];
  }

  private async build(manager: CLUEGraphManager, mode: ESessionListMode) {

    const $parent = select(this.parent).classed('menuTable', true).html(`
      <div class="loading">
        <i class="fa fa-spinner fa-pulse fa-fw"></i>
        <span class="sr-only">Loading...</span>
      </div>`);

    //select and sort by date
    const workspaces = selectWorkspaces(await manager.list(), mode).sort((a: any, b: any) => -((a.ts || 0) - (b.ts || 0)));

    //replace loading
    const $table = $parent.html(SessionList.TEMPLATE);

    const $tr = $table.select('tbody').selectAll('tr').data(workspaces);

    const $trEnter = $tr.enter().append('tr').attr('id', (d) => d.id);
    $trEnter.append('td').text((d) => d.name);
    $trEnter.append('td').text((d) => d.ts ? new Date(d.ts).toUTCString() : 'Unknown');
    $trEnter.append('td').text((d) => d.creator);
    $trEnter.append('td').html((d) => {
      return `<button class="btn btn-xs btn-default" data-action="select" ${!isLoggedIn() ? 'disabled="disabled"' : ''}><span class="fa fa-folder-open" aria-hidden="true"></span> Select</button>
      <button class="btn btn-xs btn-default" data-action="clone"><span class="fa fa-clone" aria-hidden="true"></span> Clone</button>
      <button class="btn btn-xs btn-default" data-action="delete" ${!isLoggedIn() ? 'disabled="disabled"' : ''}><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>`;
    });

    $trEnter.select('button[data-action="delete"]').on('click', async(d) => {
      const deleteIt = await areyousure(`Are you sure to delete: "${d.name}"`);
      if (deleteIt) {
        await manager.delete(d);
        $table.selectAll('#' + d.id).remove();
      }
    });
    $trEnter.select('button[data-action="clone"]').on('click', (d) => {
      manager.loadOrClone(d, false);
      return false;
    });
    $trEnter.select('button[data-action="select"]').on('click', (d) => {
      manager.loadGraph(d);
      return false;
    });
  }
}

function selectWorkspaces(workspaces: IProvenanceGraphDataDescription[], mode: ESessionListMode) {
  const isPersistent = (d: any) => d.local === false || d.local === undefined;
  const me = session.retrieve('username');

  switch (mode) {
    case ESessionListMode.PUBLIC_ONES:
      return workspaces.filter((d) => isPersistent(d) && d.creator !== me);
    case ESessionListMode.TEMPORARY:
      return workspaces.filter((d) => !isPersistent(d));
    default:
      return workspaces.filter((d) => isPersistent(d) && d.creator === me);
  }
}

export function create(parent: HTMLElement, desc: IPluginDesc, options: IStartMenuOptions) {
  return new SessionList(parent, desc, options);
}
