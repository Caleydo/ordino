import { ILoginMenuAdapter } from "tdp_core";
export declare class HeaderAdapter implements ILoginMenuAdapter {
    hideDialog(selector: string): void;
    showAndFocusOn(selector: string, focusSelector: string): void;
    wait(): void;
    ready(): void;
    private static setVisibility;
}
