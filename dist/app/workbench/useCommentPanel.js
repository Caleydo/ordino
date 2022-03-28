import React from 'react';
import { CommentPanel, defaultUploadComment } from 'tdp_comments';
export function useCommentPanel(commentsOpen) {
    const [instance, setInstance] = React.useState(null);
    const parentRef = React.useRef(null);
    const setRef = React.useCallback(async (ref) => {
        setInstance((currentInstance) => {
            // If the element ref did not change, do nothing.
            if (currentInstance && ref) {
                return currentInstance;
            }
            // Create a new one if there is a ref
            if (ref) {
                parentRef.current = ref;
                const panel = new CommentPanel({
                    appKey: 'reprovisyn',
                    commentTemplate: defaultUploadComment({ app_key: 'reprovisyn' }),
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
    }, []);
    React.useEffect(() => {
        instance === null || instance === void 0 ? void 0 : instance.toggle(commentsOpen);
    }, [instance, commentsOpen]);
    return [setRef, instance];
}
//# sourceMappingURL=useCommentPanel.js.map