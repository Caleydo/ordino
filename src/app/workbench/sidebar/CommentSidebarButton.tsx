import React, { useCallback } from 'react';
import { CommentActions, CommentsRest, IComment } from 'tdp_comments';
import { IEvent, useAsync } from 'tdp_core';
import { ISidebarButtonProps, SidebarButton } from './SidebarButton';

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
  onClick: (s: string) => void;
  isSelected: boolean;
  color: string;
}

export function CommentSidebarButton({
  idType,
  selection,
  onClick,
  isSelected,
  icon,
  color,
}: ISidebarButtonProps & {
  idType: string;

  selection: string[];
}) {
  const [commentCount, setCommentCount] = React.useState<number>(0);
  const [commentCountDirty, setCommentCountDirty] = React.useState(false);

  React.useEffect(() => {
    const listener = (_: IEvent, comment: Readonly<IComment>) => {
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
    if (!commentCountDirty) {
      return;
    }
    if (selection.length === 0) {
      return;
    }
    const comments = await CommentsRest.getCommentsMatching({
      entities: [{ id_types: [idType], entity_ids: selection }],
    });
    const count = comments.filter((comment) => comment.entities.some((e) => selection.includes(e.entity_id)))?.length;
    setCommentCountDirty(false);
    setCommentCount(count);
  }, [idType, selection, commentCountDirty]);
  const { status } = useAsync(loadCommentCount, []);

  const Badge = useCallback(() => {
    return (
      <span
        className="position-absolute translate-middle badge rounded-pill bg-danger" // this will not work if the breadcrumb itself is of color read
        style={{
          top: '27%',
          left: '76%',
          fontSize: 'xx-small',
          visibility: commentCount ? null : 'hidden',
        }}
      >
        {status === 'success' ? commentCount : <i className="fas fa-circle-notch fa-spin" />}
      </span>
    );
  }, [status, commentCount]);

  return <SidebarButton isSelected={isSelected} color={color} icon={icon} onClick={onClick} extensions={{ Badge }} />;
}
