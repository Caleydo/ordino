import { ComponentType } from 'react';
export interface ISidebarButtonProps {
    isSelected: boolean;
    color: string;
    onClick: (s: string) => void;
    icon: string;
    extensions?: {
        Badge?: ComponentType;
    };
}
export declare function SidebarButton({ isSelected, color, onClick, icon, extensions: { Badge } }: ISidebarButtonProps): JSX.Element;
//# sourceMappingURL=SidebarButton.d.ts.map