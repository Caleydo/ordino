import * as React from "react";
export interface VisynHeaderProps {
    extensions?: {
        AppLogo?: React.ReactElement | null;
        VisynLogo?: React.ReactElement | null;
        LeftExtensions?: React.ReactElement | null;
        RightExtensions?: React.ReactElement | null;
        CustomerLogo?: React.ReactElement | null;
        configurationMenu?: React.ReactElement<{
            extensions: {
                menuItems: React.ReactElement | null;
            };
        }> | null;
        burgerMenu?: React.ReactElement<{
            extensions: {
                sidebar: React.ReactElement | null;
            };
        }> | null;
    };
    burgerMenuEnabled?: boolean;
    configMenuEnabled?: boolean;
}
export declare function VisynHeader({ extensions: { VisynLogo, CustomerLogo, configurationMenu, burgerMenu, AppLogo, LeftExtensions, RightExtensions }, burgerMenuEnabled, configMenuEnabled }: VisynHeaderProps): JSX.Element;
