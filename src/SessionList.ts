/**
 * Created by Holger Stitz on 27.07.2016.
 */

import * as session from 'phovea_core/src/session';
import {areyousure, FormDialog, generateDialog} from 'phovea_ui/src/dialogs';
import {IPluginDesc} from 'phovea_core/src/plugin';
import {IStartMenuSectionEntry, IStartMenuOptions} from './StartMenu';
import {select} from 'd3';
import {isLoggedIn, currentUserNameOrAnonymous, canWrite, ALL_READ_READ, ALL_READ_NONE} from 'phovea_core/src/security';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {IProvenanceGraphDataDescription, op} from 'phovea_core/src/provenance';
import {KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES} from './constants';
import {randomId} from 'phovea_core/src';
import {showErrorModalDialog} from 'ordino/src/Dialogs';

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
      let buttons = ``;
      if (isLoggedIn() || mode === ESessionListMode.TEMPORARY) {
        buttons += `<button class="btn btn-xs btn-default" data-action="select" title="Select"><i class="fa fa-folder-open" aria-hidden="true"></i><span class="sr-only">Select</span></button>`;
      }
      buttons += `<button class="btn btn-xs btn-default" data-action="clone" title="Clone"><i class="fa fa-clone" aria-hidden="true"></i><span class="sr-only">Clone</span></button>`;
      if (mode === ESessionListMode.TEMPORARY) {
        buttons += `<button class="btn btn-xs btn-default" data-action="persist" title="Persist"><i class="fa fa-save" aria-hidden="true"></i><span class="sr-only">Persist</span></button>`;
      }
      if ((isLoggedIn() && canWrite(d)) || mode === ESessionListMode.TEMPORARY) {
        buttons += `<button class="btn btn-xs btn-default" data-action="edit" title="Edit"><i class="fa fa-edit" aria-hidden="true"></i><span class="sr-only">Edit</span></button>`;
      }
      if ((isLoggedIn() && canWrite(d)) || mode === ESessionListMode.TEMPORARY) {
        buttons += `<button class="btn btn-xs btn-default" data-action="delete" title="Delete"><i class="fa fa-trash" aria-hidden="true"></i><span class="sr-only">Delete</span></button>`;
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
      if (!canWrite(d)) {
        manager.loadOrClone(d, false);
      } else {
        manager.loadGraph(d);
      }
      return false;
    });
    $trEnter.select('button[data-action="edit"]').on('click', function (this:HTMLButtonElement, d) {
      const nameTd = this.parentElement.parentElement.querySelector('td');
      editDialog(d, 'Edit').then((extras) => {
        if (extras !== null) {
          manager.editGraphMetaData(d, extras)
            .then((desc) => {
              //update the name
              nameTd.innerText = desc.name;
            })
            .catch(showErrorModalDialog);
        }
      });
      return false;
    });
    $trEnter.select('button[data-action="persist"]').on('click', (d) => {
      editDialog(d, 'Import').then((extras) => {
        if (extras !== null) {
          manager.importExistingGraph(d, extras).catch(showErrorModalDialog);
        }
      });
      return false;
    });
  }
}

function selectWorkspaces(workspaces: IProvenanceGraphDataDescription[], mode: ESessionListMode) {
  const isPersistent = (d: any) => d.local === false || d.local === undefined;
  const me = currentUserNameOrAnonymous();

  switch (mode) {
    case ESessionListMode.PUBLIC_ONES:
      return workspaces.filter((d) => isPersistent(d) && d.creator !== me);
    case ESessionListMode.TEMPORARY:
      return workspaces.filter((d) => !isPersistent(d));
    default:
      return workspaces.filter((d) => isPersistent(d) && d.creator === me);
  }
}

async function editDialog(d: IProvenanceGraphDataDescription, operation: string = 'Import') {
  const dialog = new FormDialog(operation + ' Provenance Graph', operation);
  const prefix = 'd' + randomId();
  dialog.form.innerHTML = `
    <form>
        <div class="form-group">
          <label for="${prefix}_name">Name</label>
          <input type="text" class="form-control" id="${prefix}_name" value="${d.name}" required="required">
        </div>
        <div class="form-group">
          <label for="${prefix}_desc">Description</label>
          <textarea class="form-control" id="${prefix}_desc" rows="3">${d.description || ''}</textarea>
        </div>
        <div class="checkbox">
          <label>
            <input type="checkbox" id="${prefix}_public"> Public (everybody can see and use it)
          </label>
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
        description: (<HTMLTextAreaElement>dialog.body.querySelector(`#${prefix}_desc`)).value,
        permissions: (<HTMLInputElement>dialog.body.querySelector(`#${prefix}_public`)).checked ? ALL_READ_READ : ALL_READ_NONE
      };
      resolve(extras);
    });
    dialog.show();
  });
}

export function create(parent: HTMLElement, desc: IPluginDesc, options: IStartMenuOptions) {
  return new SessionList(parent, desc, options);
}
