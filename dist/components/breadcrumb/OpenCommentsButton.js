import React from 'react';
import { CommentActions } from 'tdp_comments';
import { I18nextManager } from 'tdp_core';
export function OpenCommentsButton({ idType, selection, commentPanelVisible, onCommentPanelVisibilityChanged }) {
    const [commentCount, setCommentCount] = React.useState(0);
    React.useEffect(() => {
        const listener = (_, comments) => {
            // TODO: should we count the replies? The original button from tdp_comments shows the count of unread comments and + replies
            // comments.map((c) => c.replies.filter((r) => !r.read).length);
            const count = comments.filter((c) => c.entities.some((e) => e.id_type === idType)).length;
            setCommentCount(count);
        };
        CommentActions.onChangedComments(listener);
        const visibilityListener = (_, visible) => onCommentPanelVisibilityChanged(visible);
        CommentActions.onCommentPanelVisibiltyChanged(visibilityListener);
        return () => {
            CommentActions.offChangedComments(listener);
            CommentActions.offCommentPanelVisibiltyChanged(visibilityListener);
        };
    }, [idType, onCommentPanelVisibilityChanged]);
    React.useEffect(() => {
        if (selection.length) {
            return;
        }
        onCommentPanelVisibilityChanged(false);
    }, [onCommentPanelVisibilityChanged, selection]);
    const title = commentPanelVisible
        ? I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.hideComments')
        : commentCount
            ? I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.availableComments', { count: commentCount })
            : I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.showComments');
    return selection.length > 0 ? (React.createElement("button", { type: "button", title: title, className: "pe-auto btn btn-icon-light position-relative", onClick: () => onCommentPanelVisibilityChanged(!commentPanelVisible) },
        React.createElement("span", null,
            React.createElement("i", { className: "flex-grow-1 fas fa-comments" }),
            React.createElement("span", { className: "position-absolute translate-middle badge rounded-pill bg-danger" // this will not work if the breadcrumb itself is of color read
                , style: {
                    top: '27%',
                    left: '76%',
                    fontSize: 'xx-small',
                    visibility: commentCount ? null : 'hidden',
                } }, commentCount)))) : null;
}
//# sourceMappingURL=OpenCommentsButton.js.map