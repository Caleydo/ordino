/**
 * Created by Samuel Gratzl on 28.02.2017.
 */

import ProvenanceGraph from 'phovea_core/src/provenance/ProvenanceGraph';
import {areyousure} from 'phovea_ui/src/dialogs';
import CLUEGraphManager from 'phovea_clue/src/CLUEGraphManager';
import {showErrorModalDialog} from './Dialogs';
import {IProvenanceGraphDataDescription} from 'phovea_core/src/provenance';
import {FormDialog} from 'phovea_ui/src/dialogs';
import {mixin, randomId} from 'phovea_core/src';
import {ALL_READ_NONE, ALL_READ_READ, EEntity, hasPermission, ISecureItem} from 'phovea_core/src/security';
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
    const syncIcon = this.node.querySelector('.sync-indicator');
    const persisted = isPersistent(graph.desc);
    if (persisted) {
      syncIcon.classList.remove('fa-clock-o');
      syncIcon.classList.add('fa-cloud');
    } else {
      syncIcon.classList.add('fa-clock-o');
      syncIcon.classList.remove('fa-cloud');
    }
    (<HTMLLinkElement>this.node.querySelector('a[data-action="persist"]')).disabled = persisted;

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
             aria-expanded="false"><i class="fa fa-clock-o sync-indicator" aria-hidden="true"></i> <span>No Name</span></a>
          <ul class="dropdown-menu">
            <li><a href="#" data-action="edit" title="Edit Details"><i class="fa fa-edit" aria-hidden="true"></i> Edit Details</a></li>
            <li><a href="#" data-action="clone" title="Clone to Temporary Session"><i class="fa fa-clone" aria-hidden="true"></i> Clone to Temporary Session</a></li>
            <li class="divider"></li>
            <li><a href="#" disabled="disabled" data-action="persist" title="Persist Session"><i class="fa fa-cloud" aria-hidden="true"></i> Persist Session</a></li>
            <li><a href="#" data-action="delete" title="Delete"><i class="fa fa-trash" aria-hidden="true"></i> Delete</a></li>            
          </ul>`;

    (<HTMLLinkElement>li.querySelector('a[data-action="edit"]')).addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!this.graph) {
        return false;
      }
      editProvenanceGraphMetaData(this.graph.desc, {permission: isPersistent(this.graph.desc)}).then((extras) => {
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
      persistProvenanceGraphMetaData(this.graph.desc).then((extras: any) => {
        if (extras !== null) {
          manager.migrateGraph(this.graph, extras).catch(showErrorModalDialog);
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
      areyousure(`Are you sure to delete session: "${this.graph.desc.name}"`).then((deleteIt) => {
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

export function isPersistent(d: IProvenanceGraphDataDescription) {
  return d.local === false || d.local === undefined;
}

export function persistProvenanceGraphMetaData(d: IProvenanceGraphDataDescription) {
  const name = d.name.startsWith('Temporary') ? `Persistent ${d.name.slice(10)}` : d.name;
  return editProvenanceGraphMetaData(d, {title: '<i class="fa fa-cloud"></i> Persist Session', button: '<i class="fa fa-cloud"></i> Persist', name});
}

export function isPublic(d: ISecureItem) {
  return hasPermission(d, EEntity.OTHERS);
}

export function editProvenanceGraphMetaData(d: IProvenanceGraphDataDescription, args: {button?: string, title?: string, permission?: boolean, name?: string} = {}) {
  args = mixin({
    button: 'Edit',
    title: '<i class="fa fa-edit" aria-hidden="true"></i> Edit Session Details',
    permission: true,
    name: d.name
  }, args);
  const dialog = new FormDialog(args.title, args.button);
  const prefix = 'd' + randomId();
  dialog.form.innerHTML = `
    <form>
        <div class="form-group">
          <label for="${prefix}_name">Name</label>
          <input type="text" class="form-control" id="${prefix}_name" value="${args.name}" required="required">
        </div>
        <div class="form-group">
          <label for="${prefix}_desc">Description</label>
          <textarea class="form-control" id="${prefix}_desc" rows="3">${d.description || ''}</textarea>
        </div>
        <div class="checkbox" ${!args.permission ? `style="display: none"`: ''}>
          <label class="radio-inline">
            <input type="radio" name="${prefix}_public" value="private" ${!isPublic(d) ? 'checked="checked"': ''}> <i class="fa fa-user"></i> Private
          </label>
          <label class="radio-inline">
            <input type="radio" name="${prefix}_public" id="${prefix}_public" value="public" ${isPublic(d) ? 'checked="checked"': ''}> <i class="fa fa-users"></i> Public (everybody can see and use it)
          </label>
          <div class="help-block">
            Please ensure when publishing a session that associated datasets (i.e. uploaded datasets) are also public.
          </div>
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
      return false;
    });
    dialog.show();
  });
}
