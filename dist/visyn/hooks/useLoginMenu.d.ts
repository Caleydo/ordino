import { LoginMenu } from 'tdp_core';
/**
 * Instantiates the login menu and appends the user dropdown to the header
 */
export declare function useLoginMenu(): {
    ref: (element: HTMLElement | null) => void;
    loggedIn: boolean;
    instance: LoginMenu | null;
};
