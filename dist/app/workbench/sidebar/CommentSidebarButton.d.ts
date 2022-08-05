import { ISidebarButtonProps } from './SidebarButton';
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
export declare function CommentSidebarButton({ idType, selection, onClick, isSelected, icon, color, }: ISidebarButtonProps & {
    idType: string;
    selection: string[];
}): JSX.Element;
//# sourceMappingURL=CommentSidebarButton.d.ts.map