interface ISavedSessionListItemProps {
    name: string;
    description?: string;
    uploadedDate?: string;
    accessType: 'public' | 'private';
    fileIcon?: string;
    onClick?: () => void;
}
export declare function SavedSessionListItem({ name, uploadedDate, accessType, description }: ISavedSessionListItemProps): JSX.Element;
export {};
