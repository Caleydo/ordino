interface IUploadDatasetListItemProps {
    name: string;
    accessType: 'public' | 'private';
    description?: string;
    uploadedDate?: string;
    fileIcon?: string;
    onClick?: () => void;
}
export declare function UploadDatasetListItem({ name, accessType, uploadedDate, description }: IUploadDatasetListItemProps): JSX.Element;
export {};
