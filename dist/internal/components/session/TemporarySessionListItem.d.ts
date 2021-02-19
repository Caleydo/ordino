import { IProvenanceGraphDataDescription } from 'phovea_core';
interface ITemporarySessionListItemProps {
    value: IProvenanceGraphDataDescription | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    error: string | null;
    description?: string;
}
export declare function TemporarySessionListItem({ status, value, error, description }: ITemporarySessionListItemProps): JSX.Element;
export {};
