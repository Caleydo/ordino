/**
 * Created by Holger Stitz on 27.07.2016.
 */

import * as session from 'phovea_core/src/session';
import {areyousure, generateDialog} from 'phovea_ui/src/dialogs';
import {IPluginDesc} from 'phovea_core/src/plugin';
import {IStartMenuSectionEntry, IStartMenuOptions} from './StartMenu';
import {select} from 'd3';
import {isLoggedIn} from 'phovea_clue/src/user';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {IProvenanceGraphDataDescription} from 'phovea_core/src/provenance';
import {KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES} from './constants';
import {randomId} from 'phovea_core/src';

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

    //select and sort by date desc
    let workspaces = selectWorkspaces(await manager.list(), mode).sort((a: any, b: any) => -((a.ts || 0) - (b.ts || 0)));

    // cleanup up temporary ones
    if (mode === ESessionListMode.TEMPORARY && workspaces.length > KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES) {
      const toDelete = workspaces.slice(KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES);
      workspaces = workspaces.slice(0, KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES);
      Promise.all(toDelete.map((d) => manager.delete(d))).catch((error) => {
        console.warn('cannot delete old graphs:', error);
      });
    }

    //replace loading
    const $table = $parent.html(SessionList.TEMPLATE);

    const $tr = $table.select('tbody').selectAll('tr').data(workspaces);

    const $trEnter = $tr.enter().append('tr').attr('id', (d) => d.id);
    $trEnter.append('td').text((d) => d.name);
    $trEnter.append('td').text((d) => d.ts ? new Date(d.ts).toUTCString() : 'Unknown');
    $trEnter.append('td').text((d) => d.creator);
    $trEnter.append('td').html((d) => {
      let buttons = '';
      if (isLoggedIn()) {
        buttons += `<button class="btn btn-xs btn-default" data-action="select"><span class="fa fa-folder-open" aria-hidden="true"></span> Select</button>`;
      }
      buttons += `<button class="btn btn-xs btn-default" data-action="clone"><span class="fa fa-clone" aria-hidden="true"></span> Clone</button>`;
      if (mode === ESessionListMode.TEMPORARY) {
        buttons += `<button class="btn btn-xs btn-default" data-action="persist"}><i class="fa fa-save" aria-hidden="true"></i> Persist</button>`;
      }
      if (isLoggedIn() || mode === ESessionListMode.TEMPORARY) {
        buttons += `<button class="btn btn-xs btn-default" data-action="delete"><i class="fa fa-trash" aria-hidden="true"></i> Delete</button>`;
      }
      return buttons;
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
    $trEnter.select('button[data-action="persist"]').on('click', async (d) => {
      const extras = await importDialog(d);
      if (extras !== null) {
        manager.importExistingGraph(d, extras);
      }
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

async function importDialog(d: IProvenanceGraphDataDescription) {
  const dialog = generateDialog('Import Provenance Graph', 'Import');
  const prefix = 'd' + randomId();
  dialog.body.innerHTML = `
    <form>
        <div class="form-group">
          <label for="${prefix}_name">Name</label>
          <input type="text" class="form-control" id="${prefix}_name" value="${d.name}" required="required">
        </div>
        <div class="form-group">
          <label for="${prefix}_desc">Description</label>
          <textarea class="form-control" id="${prefix}_desc" rows="3">${d.description || ''}</textarea>
        </div>
    </form>
  `;
  return new Promise((resolve) => {
    dialog.onHide(() => {
      resolve(null);
    });
    dialog.onSubmit(() => {
      const extras = {
        name: (<HTMLInputElement>dialog.body.querySelector(`#${prefix}_name`)).value,
        description: (<HTMLTextAreaElement>dialog.body.querySelector(`#${prefix}_desc`)).value
      };
      resolve(extras);
    });
    dialog.show();
  });
}

export function create(parent: HTMLElement, desc: IPluginDesc, options: IStartMenuOptions) {
  return new SessionList(parent, desc, options);
}
