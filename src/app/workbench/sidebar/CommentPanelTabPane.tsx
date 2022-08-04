import React from 'react';
import { CommentPanel, defaultUploadComment, IMatchingCommentTemplate } from 'tdp_comments';

export const ORDINO_APP_KEY = 'reprovisyn';

export function CommentPanelTabPane({ selection, itemIDType }: { selection: string[]; itemIDType: string }) {
  const [instance, setInstance] = React.useState<CommentPanel | null>(null);
  const setRef = React.useCallback(async (ref: HTMLElement | null) => {
    setInstance((currentInstance) => {
      // If the element ref did not change, do nothing.
      if (currentInstance && ref) {
        return currentInstance;
      }

      // Create a new one if there is a ref
      if (ref) {
        const panel = new CommentPanel({
          appKey: ORDINO_APP_KEY,
          commentTemplate: defaultUploadComment({ app_key: ORDINO_APP_KEY }),
          commentFormOptions: {
            customizations: [],
            visibleEntity: true,
            entitySelectOptions: {
              required: true,
            },
          },
          editFormOptions: {
            visibleEntity: false,
          },
          replyFormOptions: {
            addableAttachments: false,
            enableRating: false,
          },
          editReplyFormOptions: {
            visibleEntity: false,
            enableRating: false,
          },
        });
        ref.appendChild(panel.node);
        return panel;
      }
      // Set instance to null if no ref is passed
      return null;
    });
  }, []);

  React.useEffect(() => {
    instance?.toggle(true);
  }, [instance]);

  React.useEffect(() => {
    if (!instance) {
      return;
    }
    const template = {
      ...defaultUploadComment({ app_key: ORDINO_APP_KEY }),
      ...{ entities: selection.map((s: string) => ({ id_type: itemIDType, entity_id: s })) },
    };
    const matching: IMatchingCommentTemplate = {
      entities: selection.length > 0 ? [{ id_types: [itemIDType], entity_ids: selection }] : [],
    };
    instance.showMatchingComments(matching.entities.length > 0 ? matching : undefined);
    instance.adaptNewCommentForm(template);
  }, [instance, itemIDType, selection]);

  return <div ref={setRef} style={{ width: '650px' }} className="d-flex position-relative" />;
}
