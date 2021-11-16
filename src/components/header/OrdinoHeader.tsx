// import * as React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {BILogo, ConfigMenuOptions, ConfigurationMenu, HeaderTabs, VisynHeader} from '../..';
// import {ITab} from './menu/StartMenuTabWrapper';

// export interface IOrdinoHeaderProps {
//   extensions?: {
//     tabs?: ITab[],
//     customerLogo?: React.ReactElement | null,
//   };
// }

// export function OrdinoHeader({
//     extensions: {
//         tabs = null,
//         customerLogo = null,
//     } = {}
// }: IOrdinoHeaderProps) {
//   return (
//     <VisynHeader
//         burgerMenuEnabled={false}
//         extensions={{
//             CustomerLogo: customerLogo,
//             AppLogo: <OrdinoLogo2 />,
//             LeftExtensions: <HeaderTabs />,
//             configurationMenu: <ConfigurationMenu extensions={{menuItems: <ConfigMenuOptions />}} />
//         }}
//     />
//   );
// }
