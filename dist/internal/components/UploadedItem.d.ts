interface IUploadedItemProps {
    name: string;
    accessType: 'public' | 'private';
    description?: string;
    uploadedDate?: string;
    fileIcon?: string;
    onClick?: () => void;
}
export declare function UploadedItem({ name, accessType, uploadedDate, description }: IUploadedItemProps): JSX.Element;
interface ICurrentItemProps {
    name: string;
    description?: string;
    uploadedDate?: string;
    fileIcon?: string;
    onClick?: () => void;
}
export declare function CurrentItem({ name, uploadedDate, description }: ICurrentItemProps): JSX.Element;
interface ISavedItemProps {
    name: string;
    description?: string;
    uploadedDate?: string;
    accessType: 'public' | 'private';
    fileIcon?: string;
    onClick?: () => void;
}
export declare function SavedItem({ name, uploadedDate, accessType, description }: ISavedItemProps): JSX.Element;
export {};
