import {IDType, list, defaultSelectionType, EVENT_REGISTER_IDTYPE} from 'phovea_core/src/idtype';
import Range from 'phovea_core/src/range/Range';
import {on} from 'phovea_core/src/event';
import {IAppExtensionContext} from 'tdp_core/src/extensions';
import {IMatchingCommentTemplate} from 'tdp_comments/src/model/interfaces';
import CommentPanel from 'tdp_comments/src/ui/CommentPanel';
import {createCommentTemplate} from './template';

function selectionAdapter(selectionChanged: (idType: IDType, selection: string[]) => void) {

  const listen = (idType: IDType) => {
    idType.on(IDType.EVENT_SELECT, (_, type: string, selection: Range) => {
      if (type !== defaultSelectionType) {
        return;
      }
      idType.unmap(selection).then((r) => selectionChanged(idType, r));
    });
  };

  list().forEach(listen);

  on(EVENT_REGISTER_IDTYPE, (_, idType: IDType) => listen(idType));
}

export function create({header, content, app}: IAppExtensionContext) {
  //const ordino: OrdinoApp = app;
  let panel: CommentPanel;

  const template = createCommentTemplate();
  const matching: IMatchingCommentTemplate = {
    entities: []
  };


  const node = header.addRightMenu('Comments', (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (panel.toggle()) {
      // become visible
      panel.showMatchingComments(matching.entities!.length > 0 ? matching : undefined);
      panel.adaptNewCommentForm(template.context || [], template.entities || []);
    }
  });
  node.firstElementChild!.innerHTML = '<i class="fa fa-comments"></i>';

  panel = new CommentPanel({
    doc: content.ownerDocument,
    header: node,
    template,
    newCommentTemplate: template,
    formOptions: {
      editableEntity: true
    }
  });
  panel.toggle(false);
  content.appendChild(panel.node);

  // SelectionAdapter: a callback function is registered, which is called whenever an entity is selected in Ordino (e.g. inside a detail view)
  selectionAdapter((idType, selection) => {
    // during each selection the template (for default values in the comment form) as well as the matching (the selected entity IDs) is updated
    template.entities = selection.map((d) => ({id_type: idType.id, entity_id: d, category: 'primary'}));
    matching.entities = selection.length > 0 ? [{id_type: idType.id, entity_ids: selection}] : [];

    if (panel && panel.isVisible) {
      panel.showMatchingComments(matching.entities!.length > 0 ? matching : undefined);
      panel.adaptNewCommentForm(template.context || [], template.entities || []);
    }
  });

  // TODO better context?
}
