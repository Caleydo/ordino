/**
 * Created by Samuel Gratzl on 28.02.2017.
 */

import ProvenanceGraph from 'phovea_core/src/provenance/ProvenanceGraph';
import {areyousure} from 'phovea_ui/src/dialogs';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {showErrorModalDialog} from 'ordino/src/Dialogs';
import {IProvenanceGraphDataDescription} from 'phovea_core/src/provenance';
import {FormDialog} from 'phovea_ui/src/dialogs';
import {randomId} from 'phovea_core/src';
import {ALL_READ_NONE, ALL_READ_READ, EEntity, hasPermission} from 'phovea_core/src/security';
import {IEvent} from 'phovea_core/src/event';


export default class EditProvenanceGraphMenu {
  readonly node: HTMLLIElement;
  private graph: ProvenanceGraph = null;

  constructor(private readonly manager: CLUEGraphManager, parent: HTMLElement) {
    this.node = this.init(parent);
    parent.insertBefore(this.node, parent.firstChild);
  }

  setGraph(graph: ProvenanceGraph) {
    this.node.querySelector('a span').innerHTML = graph.desc.name;
    (<HTMLLinkElement>this.node.querySelector('a[data-action="persist"]')).disabled = !graph.desc.local;

    const syncIcon = this.node.querySelector('.sync-indicator');
    graph.on('sync_start,sync', (event: IEvent) => {
      const should = event.type !== 'sync';
      const has = syncIcon.classList.contains('active');
      if (should !== has) {
        if (should) {
          syncIcon.classList.add('active');
        } else {
          syncIcon.classList.remove('active');
        }
      }
    });

    this.graph = graph;
  }

  private init(parent: HTMLElement) {
    const manager = this.manager;
    //add provenance graph management menu entry
    const li = parent.ownerDocument.createElement('li');
    li.classList.add('dropdown');

    li.innerHTML = `
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
             aria-expanded="false"><i class="fa fa-save sync-indicator" aria-hidden="true"></i> <span>No Name</span></a>
          <ul class="dropdown-menu">
            <li><a href="#" data-action="edit" title="Edit"><i class="fa fa-edit" aria-hidden="true"></i> Edit</span></a></li>
            <li><a href="#" data-action="clone" title="Clone"><i class="fa fa-clone" aria-hidden="true"></i> Clone</a></li>
            <li class="divider"></li>
            <li><a href="#" disabled="disabled" data-action="persist" title="Persist"><i class="fa fa-save" aria-hidden="true"></i> Persist</a></li>
            <li><a href="#" data-action="delete" title="Delete"><i class="fa fa-trash" aria-hidden="true"></i> Delete</a></li>            
          </ul>`;

    (<HTMLLinkElement>li.querySelector('a[data-action="edit"]')).addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!this.graph) {
        return false;
      }
      editProvenanceGraphMetaData(this.graph.desc, 'Edit').then((extras) => {
        if (extras !== null) {
          manager.editGraphMetaData(this.graph.desc, extras)
            .then((desc) => {
              //update the name
              this.node.querySelector('a span').innerHTML = desc.name;
            })
            .catch(showErrorModalDialog);
        }
      });
      return false;
    });

    (<HTMLLinkElement>li.querySelector('a[data-action="clone"]')).addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!this.graph) {
        return false;
      }
      this.manager.cloneLocal(this.graph.desc);
      return false;
    });

    (<HTMLLinkElement>li.querySelector('a[data-action="persist"]')).addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!this.graph) {
        return false;
      }
      editProvenanceGraphMetaData(this.graph.desc, 'Import').then((extras: any) => {
        if (extras !== null) {
          manager.importExistingGraph(this.graph.desc, extras).catch(showErrorModalDialog);
        }
      });
      return false;
    });

    (<HTMLLinkElement>li.querySelector('a[data-action="delete"]')).addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!this.graph) {
        return false;
      }
      areyousure(`Are you sure to delete: "${this.graph.desc.name}"`).then((deleteIt) => {
        if (deleteIt) {
          this.manager.delete(this.graph.desc).then((r) => {
            this.manager.startFromScratch();
          }).catch(showErrorModalDialog);
        }
      });
      return false;
    });

    return li;
  }
}

export function editProvenanceGraphMetaData(d: IProvenanceGraphDataDescription, title: string = 'Edit') {
  const dialog = new FormDialog(title + ' Provenance Graph', title);
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
            <input type="checkbox" id="${prefix}_public" ${hasPermission(d, EEntity.OTHERS) ? 'checked="checked"' : ''}> Public (everybody can see and use it)
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
      dialog.hide();
    });
    dialog.show();
  });
}
