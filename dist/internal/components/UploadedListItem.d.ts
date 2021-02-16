interface IUploadedListItemProps {
    name: string;
    accessType: 'public' | 'private';
    description?: string;
    uploadedDate?: string;
    fileIcon?: string;
    onClick?: () => void;
}
export declare function UploadedListItem({ name, accessType, uploadedDate, description }: IUploadedListItemProps): JSX.Element;
export {};
