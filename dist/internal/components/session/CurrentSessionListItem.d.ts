import { IProvenanceGraphDataDescription } from 'phovea_core';
interface ICurrentSessionListItemProps {
    value: IProvenanceGraphDataDescription | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    error: string | null;
    description?: string;
    onClick?: () => void;
}
export declare function CurrentSessionListItem({ status, value, error, description }: ICurrentSessionListItemProps): JSX.Element;
export {};
