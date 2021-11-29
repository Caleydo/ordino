import { ILoginMenuAdapter } from 'tdp_core';
/**
 * The login menu expects an adapter with the below interface
 * The ready and wait methods are handled with redux state changes
 */
export declare class HeaderAdapter implements ILoginMenuAdapter {
    hideDialog(selector: string): void;
    showAndFocusOn(selector: string, focusSelector: string): void;
    wait(): void;
    ready(): void;
}
