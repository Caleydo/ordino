import React, {ComponentType} from "react";
import {HeaderTabs, OrdinoAppLogo} from ".";
import {IVisynHeaderProps, VisynHeader} from "../visyn";
import {ITab} from "./header/menu/StartMenuTabWrapper";


export interface IOrdinoHeaderProps extends IVisynHeaderProps {
    tabs?: ITab[],
}

export function OrdinoHeader(props: IOrdinoHeaderProps) {
    return (
        <VisynHeader extensions={props.extensions} />
    );
}
