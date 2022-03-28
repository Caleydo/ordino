import React from 'react';
import { defaultUploadComment, IMatchingCommentTemplate } from 'tdp_comments';
import { useAppSelector } from '../hooks';
import { IWorkbench } from '../store/ordinoSlice';
import { useCommentPanel } from './workbench/useCommentPanel';
import { EWorkbenchType, WorkbenchViews } from './workbench/WorkbenchViews';

interface IWorkbenchProps {
  workbench: IWorkbench;
  type?: EWorkbenchType;
}

export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }: IWorkbenchProps) {
  const ordino = useAppSelector((state) => state.ordino);
  const { selection, commentsOpen, itemIDType } = workbench;
  const [setRef, commentPanel] = useCommentPanel(commentsOpen);

  React.useEffect(() => {
    if (!commentPanel) {
      return;
    }
    const template = {
      ...defaultUploadComment({ app_key: 'reprovisyn' }),
      ...{ entities: selection.map((s: string) => ({ id_type: itemIDType, entity_id: s })) },
    };
    const matching: IMatchingCommentTemplate = {
      entities: selection.length > 0 ? [{ id_types: [itemIDType], entity_ids: selection }] : [],
    };
    commentPanel.showMatchingComments(matching.entities.length > 0 ? matching : undefined);
    commentPanel.adaptNewCommentForm(template);
  }, [commentPanel, itemIDType, selection]);

  return (
    <div
      ref={setRef}
      className={`d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusViewIndex === 0 ? 'start' : ''}`}
      style={{ borderTopColor: ordino.colorMap[workbench.entityId] }}
    >
      <WorkbenchViews index={workbench.index} type={type} />
    </div>
  );
}
