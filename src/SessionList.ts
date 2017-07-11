/**
 * Created by Holger Stitz on 27.07.2016.
 */

import {areyousure} from 'phovea_ui/src/dialogs';
import {IPluginDesc} from 'phovea_core/src/plugin';
import {IStartMenuSectionEntry, IStartMenuOptions} from './StartMenu';
import {select, Selection, event} from 'd3';
import * as $ from 'jquery';
import {currentUserNameOrAnonymous, canWrite} from 'phovea_core/src/security';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {IProvenanceGraphDataDescription, op} from 'phovea_core/src/provenance';
import {KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES} from './constants';
import {showErrorModalDialog} from './Dialogs';
import {
  editProvenanceGraphMetaData, isPersistent, isPublic,
  persistProvenanceGraphMetaData
} from './EditProvenanceGraphMenu';


abstract class ASessionList implements IStartMenuSectionEntry {
  constructor(private readonly parent: HTMLElement, public readonly desc: IPluginDesc, private readonly options: IStartMenuOptions) {
    this.build(options.targid.graphManager);
  }

  getEntryPointLists() {
    return [];
  }

  protected createButton(type: 'delete' | 'select' | 'clone' | 'persist' | 'edit') {
    switch (type) {
      case 'delete':
        return `<a href="#" data-action="delete" title="Delete Session" ><i class="fa fa-trash" aria-hidden="true"></i><span class="sr-only">Delete</span></a>`;
      case 'select':
        return `<a href="#" data-action="select" title="Continue Session"><i class="fa fa-folder-open" aria-hidden="true"></i><span class="sr-only">Continue</span></a>`;
      case 'clone':
        return `<a href="#" data-action="clone" title="Clone to Temporary Session"><i class="fa fa-clone" aria-hidden="true"></i><span class="sr-only">Clone to Temporary Session</span></a>`;
      case 'persist':
        return `<a href="#" data-action="persist" title="Persist Session"><i class="fa fa-cloud" aria-hidden="true"></i><span class="sr-only">Persist Session</span></a>`;
      case 'edit':
        return `<a href="#" data-action="edit" title="Edit Session Details"><i class="fa fa-edit" aria-hidden="true"></i><span class="sr-only">Edit Session Details</span></a>`;
    }
  }

  protected registerActionListener(manager: CLUEGraphManager, $trEnter: Selection<IProvenanceGraphDataDescription>) {
    const stopEvent = () => {
      (<Event>event).preventDefault();
      (<Event>event).stopPropagation();
    };

    $trEnter.select('a[data-action="delete"]').on('click', async function (d) {
      stopEvent();
      const deleteIt = await areyousure(`Are you sure to delete session: "${d.name}"`);
      if (deleteIt) {
        await manager.delete(d);
        const tr = this.parentElement.parentElement;
        tr.remove();
      }
    });
    $trEnter.select('a[data-action="clone"]').on('click', (d) => {
      stopEvent();
      manager.cloneLocal(d);
      return false;
    });
    $trEnter.select('a[data-action="select"]').on('click', (d) => {
      stopEvent();
      if (!canWrite(d)) {
        manager.cloneLocal(d);
      } else {
        manager.loadGraph(d);
      }
      return false;
    });
    $trEnter.select('a[data-action="edit"]').on('click', function (this: HTMLButtonElement, d) {
      stopEvent();
      const nameTd = this.parentElement.parentElement.querySelector('td');
      const publicI = this.parentElement.parentElement.querySelector('td:nth-child(2) i');
      editProvenanceGraphMetaData(d, 'Edit').then((extras) => {
        if (extras !== null) {
          manager.editGraphMetaData(d, extras)
            .then((desc) => {
              //update the name
              nameTd.innerText = desc.name;
              publicI.className = isPublic(desc) ? 'fa fa-users' : 'fa fa-user';
              publicI.setAttribute('title', isPublic(d) ? 'Public (everyone can see it)': 'Private');
            })
            .catch(showErrorModalDialog);
        }
      });
      return false;
    });
    $trEnter.select('a[data-action="persist"]').on('click', (d) => {
      stopEvent();
      persistProvenanceGraphMetaData(d).then((extras: any) => {
        if (extras !== null) {
          manager.importExistingGraph(d, extras, true).catch(showErrorModalDialog);
        }
      });
      return false;
    });
  }

  protected createLoader() {
    return select(this.parent).classed('menuTable', true).html(`
      <div class="loading">
        <i class="fa fa-spinner fa-pulse fa-fw"></i>
        <span class="sr-only">Loading...</span>
      </div>`);
  }

  protected async abstract build(manager: CLUEGraphManager);
}

function byDateDesc(a: any, b: any) {
  return -((a.ts || 0) - (b.ts || 0));
}


class TemporarySessionList extends ASessionList {

  protected async build(manager: CLUEGraphManager) {

    const $parent = this.createLoader();

    //select and sort by date desc
    let workspaces = (await manager.list()).filter((d) => !isPersistent(d)).sort(byDateDesc);

    // cleanup up temporary ones
    if (workspaces.length > KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES) {
      const toDelete = workspaces.slice(KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES);
      workspaces = workspaces.slice(0, KEEP_ONLY_LAST_X_TEMPORARY_WORKSPACES);
      Promise.all(toDelete.map((d) => manager.delete(d))).catch((error) => {
        console.warn('cannot delete old graphs:', error);
      });
    }

    //replace loading
    const $table = $parent.html(`<table class="table table-striped table-hover table-bordered table-condensed">
    <thead>
      <tr>
        <th>Name</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>

    </tbody>
  </table>`);

    const $tr = $table.select('tbody').selectAll('tr').data(workspaces);

    const $trEnter = $tr.enter().append('tr').html(`
        <td></td>
        <td></td>
        <td>${this.createButton('select')}${this.createButton('clone')}${this.createButton('persist')}${this.createButton('delete')}</td>`);

    this.registerActionListener(manager, $trEnter);
    $tr.select('td').text((d) => d.name).attr('class', (d) => isPublic(d) ? 'public' : 'private');
    $tr.select('td:nth-of-type(2)').text((d) => d.ts ? new Date(d.ts).toUTCString() : 'Unknown');

    $tr.exit().remove();
  }
}

class PersistentSessionList extends ASessionList {


  protected async build(manager: CLUEGraphManager) {

    const $parent = this.createLoader();

    //select and sort by date desc
    const workspaces = (await manager.list()).filter((d) => isPersistent(d)).sort(byDateDesc);

    const me = currentUserNameOrAnonymous();
    const myworkspaces = workspaces.filter((d) => d.creator === me);
    const otherworkspaces = workspaces.filter((d) => d.creator !== me);

    $parent.html(`
        <ul class="nav nav-tabs" role="tablist">
          <li class="active" role="presentation"><a href="#session_mine" class="active"><i class="fa fa-user"></i> My Sessions</a></li>
          <li role="presentation"><a href="#session_others"><i class="fa fa-users"></i> Other Sessions</a></li>
        </ul>
        <div class="tab-content">
            <div id="session_mine" class="tab-pane active">
                <table class="table table-striped table-hover table-bordered table-condensed">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Access</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
            
                </tbody>
              </table>
            </div>
            <div id="session_others" class="tab-pane">
                <table class="table table-striped table-hover table-bordered table-condensed">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Creator</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
            
                </tbody>
              </table>
            </div>
       </div>`);

    $parent.selectAll('ul.nav-tabs a').on('click', function () {
      (<Event>event).preventDefault();
      $(this).tab('show');
    });

    {
      const $tr = $parent.select('#session_mine tbody').selectAll('tr').data(myworkspaces);

      const $trEnter = $tr.enter().append('tr').html(`
          <td></td>
          <td class="text-center"><i class="fa"></i></td>
          <td></td>
          <td>${this.createButton('select')}${this.createButton('clone')}${this.createButton('edit')}${this.createButton('delete')}</td>`);

      this.registerActionListener(manager, $trEnter);
      $tr.select('td').text((d) => d.name);
      $tr.select('td:nth-of-type(2) i')
        .attr('class', (d) => isPublic(d) ? 'fa fa-users': 'fa fa-user')
        .attr('title', (d) => isPublic(d) ? 'Public (everyone can see it)': 'Private');
      $tr.select('td:nth-of-type(3)').text((d) => d.ts ? new Date(d.ts).toUTCString() : 'Unknown');

      $tr.exit().remove();
    }
    {
      const $tr = $parent.select('#session_others tbody').selectAll('tr').data(otherworkspaces);

      const $trEnter = $tr.enter().append('tr').html(`
          <td></td>
          <td></td>
          <td></td>
          <td>${this.createButton('clone')}</td>`);

      this.registerActionListener(manager, $trEnter);
      $tr.select('td').text((d) => d.name);
      $tr.select('td:nth-of-type(2)').text((d) => d.creator);
      $tr.select('td:nth-of-type(3)').text((d) => d.ts ? new Date(d.ts).toUTCString() : 'Unknown');

      $tr.exit().remove();
    }

  }
}

export function createTemporary(parent: HTMLElement, desc: IPluginDesc, options: IStartMenuOptions) {
  return new TemporarySessionList(parent, desc, options);
}
export function createPersistent(parent: HTMLElement, desc: IPluginDesc, options: IStartMenuOptions) {
  return new PersistentSessionList(parent, desc, options);
}

