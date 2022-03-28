import React from 'react';
import { defaultUploadComment } from 'tdp_comments';
import { useAppSelector } from '../hooks';
import { useCommentPanel } from './workbench/useCommentPanel';
import { EWorkbenchType, WorkbenchViews } from './workbench/WorkbenchViews';
export function Workbench({ workbench, type = EWorkbenchType.PREVIOUS }) {
    const ordino = useAppSelector((state) => state.ordino);
    const { selection, commentsOpen, itemIDType } = workbench;
    const [setRef, commentPanel] = useCommentPanel(commentsOpen);
    React.useEffect(() => {
        if (!commentPanel) {
            return;
        }
        const template = {
            ...defaultUploadComment({ app_key: 'reprovisyn' }),
            ...{ entities: selection.map((s) => ({ id_type: itemIDType, entity_id: s })) },
        };
        const matching = {
            entities: selection.length > 0 ? [{ id_types: [itemIDType], entity_ids: selection }] : [],
        };
        commentPanel.showMatchingComments(matching.entities.length > 0 ? matching : undefined);
        commentPanel.adaptNewCommentForm(template);
    }, [commentPanel, itemIDType, selection]);
    return (React.createElement("div", { ref: setRef, className: `d-flex flex-grow-1 flex-shrink-0 ordino-workbench ${type} ${ordino.focusViewIndex === 0 ? 'start' : ''}`, style: { borderTopColor: ordino.colorMap[workbench.entityId] } },
        React.createElement(WorkbenchViews, { index: workbench.index, type: type })));
}
//# sourceMappingURL=Workbench.js.map