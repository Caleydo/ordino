/// <reference types="react" />
import { IOrdinoInstance } from "./Ordino";
import { AppHeader } from "phovea_ui";
export declare const OrdinoComponent: (props: {
    header: AppHeader;
    onCreated(instance: IOrdinoInstance): void;
}) => JSX.Element;
