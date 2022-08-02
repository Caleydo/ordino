import React, { useCallback } from 'react';
import { CommentActions, CommentsRest } from 'tdp_comments';
import { useAsync } from 'tdp_core';
import { SidebarButton } from './SidebarButton';
export function CommentSidebarButton({ idType, selection, onClick, isSelected, icon, color, }) {
    const [commentCount, setCommentCount] = React.useState(0);
    const [commentCountDirty, setCommentCountDirty] = React.useState(false);
    React.useEffect(() => {
        const listener = (_, comment) => {
            const selectionCommentCountChanged = comment.entities.some((e) => selection.includes(e.entity_id));
            if (selectionCommentCountChanged) {
                setCommentCountDirty(true);
            }
        };
        CommentActions.onAddComment(listener);
        CommentActions.onDeleteComment(listener);
        return () => {
            CommentActions.offAddComment(listener);
            CommentActions.offDeleteComment(listener);
        };
    }, [selection]);
    React.useEffect(() => {
        setCommentCountDirty(true);
    }, [selection]);
    const loadCommentCount = React.useCallback(async () => {
        var _a;
        if (!commentCountDirty) {
            return;
        }
        if (selection.length === 0) {
            return;
        }
        const comments = await CommentsRest.getCommentsMatching({
            entities: [{ id_types: [idType], entity_ids: selection }],
        });
        const count = (_a = comments.filter((comment) => comment.entities.some((e) => selection.includes(e.entity_id)))) === null || _a === void 0 ? void 0 : _a.length;
        setCommentCountDirty(false);
        setCommentCount(count);
    }, [idType, selection, commentCountDirty]);
    const { status } = useAsync(loadCommentCount, []);
    const Badge = useCallback(() => {
        return (React.createElement("span", { className: "position-absolute translate-middle badge rounded-pill bg-danger" // this will not work if the breadcrumb itself is of color read
            , style: {
                top: '27%',
                left: '76%',
                fontSize: 'xx-small',
                visibility: commentCount ? null : 'hidden',
            } }, status === 'success' ? commentCount : React.createElement("i", { className: "fas fa-circle-notch fa-spin" })));
    }, [status, commentCount]);
    return React.createElement(SidebarButton, { isSelected: isSelected, color: color, icon: icon, onClick: onClick, extensions: { Badge } });
}
//# sourceMappingURL=CommentSidebarButton.js.map