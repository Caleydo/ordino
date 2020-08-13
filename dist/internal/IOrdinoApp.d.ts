import { EventHandler } from 'phovea_core';
import { ViewWrapper } from './ViewWrapper';
export interface IOrdinoApp extends EventHandler {
    pushImpl(view: ViewWrapper): Promise<number>;
    removeImpl(view: ViewWrapper, focus: number): Promise<number>;
    update(): void;
    node: Element;
}
