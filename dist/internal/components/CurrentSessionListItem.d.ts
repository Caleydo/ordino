interface ICurrentSessionListItemProps {
    name: string;
    description?: string;
    uploadedDate?: string;
    fileIcon?: string;
    onClick?: () => void;
}
export declare function CurrentSessionListItem({ name, uploadedDate, description }: ICurrentSessionListItemProps): JSX.Element;
export {};
