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
export declare function OpenCommentsButton({ idType, selection, commentPanelVisible, onCommentPanelVisibilityChanged }: IOpenCommentsButtonProps): JSX.Element;
//# sourceMappingURL=OpenCommentsButton.d.ts.map