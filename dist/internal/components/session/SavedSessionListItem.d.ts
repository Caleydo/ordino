import { IProvenanceGraphDataDescription } from 'phovea_core';
interface ISavedSessionListItemProps {
    value: IProvenanceGraphDataDescription | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    error: string | null;
    description?: string;
}
export declare function SavedSessionListItem({ status, value, error, description }: ISavedSessionListItemProps): JSX.Element;
export {};
