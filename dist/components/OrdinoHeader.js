import React from 'react';
import { LoginUtils } from 'tdp_core';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { EStartMenuMode, setActiveTab, setMode } from '../store';
import { HeaderTabs } from './header/HeaderTabs';
import { StartMenuTabWrapper } from './header/StartMenuTabWrapper';
import { VisynHeader } from '../visyn';
import { VisynLoginLink } from '../visyn/LoginMenu';
export function OrdinoHeader({ tabs, extensions }) {
    const app = useAppSelector((state) => state.app);
    const ordino = useAppSelector((state) => state.ordino);
    const menu = useAppSelector((state) => state.menu);
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        // opening first ranking --> close start menu
        if (ordino.workbenches.length === 1) {
            dispatch(setMode(EStartMenuMode.OVERLAY));
            dispatch(setActiveTab(null));
        }
    }, [ordino.workbenches, dispatch]);
    React.useEffect(() => {
        if (ordino.workbenches.length === 0) {
            dispatch(setActiveTab(tabs[0].id));
        }
    }, [ordino.workbenches.length, dispatch, tabs]);
    const MemoizedLoginLink = React.useCallback(() => React.createElement(VisynLoginLink, { userName: user.userName, onLogout: LoginUtils.logout }), [user.userName]);
    const MemoizedHeaderTabs = React.useCallback(() => React.createElement(HeaderTabs, { tabs: tabs, activeTab: menu.activeTab, mode: EStartMenuMode.OVERLAY }), [menu.activeTab, tabs]);
    return (React.createElement(React.Fragment, null,
        React.createElement(VisynHeader, { extensions: {
                LeftExtensions: MemoizedHeaderTabs,
                RightExtensions: MemoizedLoginLink,
                ...extensions,
            } }),
        app.ready ? React.createElement(StartMenuTabWrapper, { tabs: tabs, activeTab: menu.activeTab, mode: EStartMenuMode.OVERLAY }) : null));
}
//# sourceMappingURL=OrdinoHeader.js.map