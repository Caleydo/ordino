import React from 'react';
import { CommentActions, IComment } from 'tdp_comments';
import { I18nextManager } from 'tdp_core';

export interface IOpenCommentsButtonProps {
  /**
   * idType of the underlying workbench data.
   */
  idType: string;

  /**
   * Workbench selection.
   */
  selection: string[];
  /**
   * CommentPanel visibility, used to display the correct title on hover.
   */
  commentPanelVisible: boolean;

  /**
   * Show/hide CommentPanel.
   */
  onCommentPanelVisibilityChanged: (open: boolean) => void;
}

export function OpenCommentsButton({ idType, selection, commentPanelVisible, onCommentPanelVisibilityChanged }: IOpenCommentsButtonProps) {
  const [commentCount, setCommentCount] = React.useState<number>(0);

  React.useEffect(() => {
    const listener = (_, comments: IComment[]) => {
      // TODO: should we count the replies? The original button from tdp_comments shows the count of unread comments and + replies
      // comments.map((c) => c.replies.filter((r) => !r.read).length);
      const count = comments.filter((c) => c.entities.some((e) => e.id_type === idType)).length;
      setCommentCount(count);
    };
    CommentActions.onChangedComments(listener);
    const visibilityListener = (_, visible: boolean) => onCommentPanelVisibilityChanged(visible);
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
    ? I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.availableComments', { comments: commentCount })
    : I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.showComments');

  return selection.length > 0 ? (
    <button type="button" title={title} className="btn btn-icon-light position-relative" onClick={() => onCommentPanelVisibilityChanged(!commentPanelVisible)}>
      <span>
        <i className="flex-grow-1 fas fa-comments" />
        <span
          className="position-absolute translate-middle badge rounded-pill bg-danger" // this will not work if the breadcrumb itself is of color read
          style={{
            top: '27%',
            left: '76%',
            fontSize: 'xx-small',
            visibility: commentCount ? null : 'hidden',
          }}
        >
          {commentCount}
        </span>
      </span>
    </button>
  ) : null;
}
