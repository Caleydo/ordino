import { isBoolean } from 'lodash';
import React from 'react';
import { CommentPanel, defaultUploadComment } from 'tdp_comments';
export const ORDINO_APP_KEY = 'reprovisyn';
export function useCommentPanel({ selection, itemIDType, commentsOpen, isFocused, }) {
    const [instance, setInstance] = React.useState(null);
    const setRef = React.useCallback(async (ref) => {
        setInstance((currentInstance) => {
            // If the element ref did not change, do nothing.
            if (currentInstance && ref) {
                return currentInstance;
            }
            // Create a new one if there is a ref
            if (ref && isFocused) {
                const panel = new CommentPanel({
                    appKey: ORDINO_APP_KEY,
                    commentTemplate: defaultUploadComment({ app_key: ORDINO_APP_KEY }),
                    enableClosePanel: true,
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
    }, [isFocused]);
    React.useEffect(() => {
        if (isBoolean(commentsOpen)) {
            instance === null || instance === void 0 ? void 0 : instance.toggle(commentsOpen);
        }
    }, [instance, commentsOpen]);
    React.useEffect(() => {
        if (!instance || !commentsOpen) {
            return;
        }
        const template = {
            ...defaultUploadComment({ app_key: ORDINO_APP_KEY }),
            ...{ entities: selection.map((s) => ({ id_type: itemIDType, entity_id: s })) },
        };
        const matching = {
            entities: selection.length > 0 ? [{ id_types: [itemIDType], entity_ids: selection }] : [],
        };
        instance.showMatchingComments(matching.entities.length > 0 ? matching : undefined);
        instance.adaptNewCommentForm(template);
    }, [instance, itemIDType, selection, commentsOpen]);
    React.useEffect(() => {
        if (!instance) {
            return;
        }
        // destroy CommentsPanel when the workbench is not focused to avoid global events affecting all instances
        if (!isFocused) {
            instance.destroy();
        }
    }, [instance, isFocused]);
    return [setRef, instance];
}
//# sourceMappingURL=useCommentPanel.js.map