import { IWelcomeView } from './IWelcomeView';
export declare class WelcomeView implements IWelcomeView {
    private parent;
    constructor(parent: HTMLElement);
    build(): void;
}
