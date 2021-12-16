import React from 'react';
import { HeaderTabs, } from '.';
import { useAppDispatch, useAppSelector } from '..';
import { setActiveTab, setMode } from '../store';
import { VisynHeader } from '../visyn';
import { EStartMenuMode, StartMenuTabWrapper } from './header/menu/StartMenuTabWrapper';
export function OrdinoHeader(props) {
    const app = useAppSelector((state) => state.app);
    const ordino = useAppSelector((state) => state.ordino);
    const menu = useAppSelector((state) => state.menu);
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        // opening first ranking --> close start menu
        if (ordino.workbenches.length === 1) {
            dispatch(setMode(EStartMenuMode.OVERLAY));
            dispatch(setActiveTab(null));
        }
    }, [ordino.workbenches]);
    React.useEffect(() => {
        if (ordino.workbenches.length === 0) {
            dispatch(setActiveTab(props.tabs[0].id));
        }
    }, [ordino.workbenches.length]);
    return (React.createElement(React.Fragment, null,
        React.createElement(VisynHeader, { extensions: {
                LeftExtensions: () => React.createElement(HeaderTabs, { tabs: props.tabs, activeTab: menu.activeTab, mode: EStartMenuMode.OVERLAY }),
                ...props.extensions
            } }),
        app.ready ? React.createElement(React.Fragment, null,
            React.createElement(StartMenuTabWrapper, { tabs: props.tabs, activeTab: menu.activeTab, mode: EStartMenuMode.OVERLAY }))
            : null));
}
//# sourceMappingURL=OrdinoHeader.js.map