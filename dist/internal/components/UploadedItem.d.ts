interface IUploadedItemProps {
    name: string;
    accessType: 'public' | 'private';
    description?: string;
    uploadedDate?: string;
    fileIcon?: string;
    onClick?: () => void;
}
export declare function UploadedItem({ name, accessType, uploadedDate, description }: IUploadedItemProps): JSX.Element;
export {};
