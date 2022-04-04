import { CommentPanel } from 'tdp_comments';
export declare const ORDINO_APP_KEY = "reprovisyn";
export interface IUseCommentPanelProps {
    selection: string[];
    itemIDType: string;
    commentsOpen: boolean;
    isFocused: boolean;
}
export declare function useCommentPanel({ selection, itemIDType, commentsOpen, isFocused, }: IUseCommentPanelProps): [(element: HTMLElement | null) => void, CommentPanel | null];
//# sourceMappingURL=useCommentPanel.d.ts.map