import { ProxyView } from 'tdp_core';
import { IFormSelectOption } from 'tdp_core';
/**
 * Proxy view for the idType Cosmic which fetches the original cell line data based on the mapping from Cell line to
 * Cosmic.
 */
export declare class CosmicProxyView extends ProxyView {
    protected getSelectionSelectData(names: string[]): Promise<IFormSelectOption[]>;
    /**
     * Specific error message to display.
     * @param {string} selectedItemId The mapped cosmic id for the selected cell line.
     */
    protected showErrorMessage(selectedItemId: string): void;
}
