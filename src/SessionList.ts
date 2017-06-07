/**
 * Created by Holger Stitz on 27.07.2016.
 */

import {areyousure} from 'phovea_ui/src/dialogs';
import {IPluginDesc} from 'phovea_core/src/plugin';
import {IStartMenuSectionEntry, IStartMenuOptions} from './StartMenu';
import {select} from 'd3';
import {isLoggedIn, currentUserNameOrAnonymous, canWrite} from 'phovea_core/src/security';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {IProvenanceGraphDataDescription, op} from 'phovea_core/src/provenance';
import {KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES} from './constants';
import {showErrorModalDialog} from 'ordino/src/Dialogs';
import {editProvenanceGraphMetaData} from './EditProvenanceGraphMenu';

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

      const canEdit = (isLoggedIn() && canWrite(d)) || mode === ESessionListMode.TEMPORARY;
      buttons += `<button class="btn btn-xs btn-default" data-action="edit" title="Edit" ${canEdit ? '': `disabled="disabled"`}><i class="fa fa-edit" aria-hidden="true"></i><span class="sr-only">Edit</span></button>`;
      if (mode === ESessionListMode.TEMPORARY) {
        buttons += `<button class="btn btn-xs btn-default" data-action="persist" title="Persist"><i class="fa fa-save" aria-hidden="true"></i><span class="sr-only">Persist</span></button>`;
      }
      buttons += `<button class="btn btn-xs btn-default" data-action="delete" title="Delete" ${canEdit && d.id !== this.options.targid.graph.desc.id ? '': `disabled="disabled"`}><i class="fa fa-trash" aria-hidden="true"></i><span class="sr-only">Delete</span></button>`;

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
      manager.cloneLocal(d);
      return false;
    });
    $trEnter.select('button[data-action="select"]').on('click', (d) => {
      if (!canWrite(d)) {
        manager.cloneLocal(d);
      } else {
        manager.loadGraph(d);
      }
      return false;
    });
    $trEnter.select('button[data-action="edit"]').on('click', function (this:HTMLButtonElement, d) {
      const nameTd = this.parentElement.parentElement.querySelector('td');
      editProvenanceGraphMetaData(d, 'Edit').then((extras) => {
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
      editProvenanceGraphMetaData(d, 'Import').then((extras: any) => {
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

export function create(parent: HTMLElement, desc: IPluginDesc, options: IStartMenuOptions) {
  return new SessionList(parent, desc, options);
}
