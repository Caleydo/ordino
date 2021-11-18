import React from 'react';
import { useDispatch } from 'react-redux';
import { HeaderTabs, } from '.';
import { useAppSelector } from '..';
import { setActiveTab, setMode } from '../store';
import { VisynHeader } from '../visyn';
import { EStartMenuMode, StartMenuTabWrapper } from './header/menu/StartMenuTabWrapper';
export function OrdinoHeader(props) {
    const ordino = useAppSelector((state) => state.ordino);
    const menu = useAppSelector((state) => state.menu);
    const dispatch = useDispatch();
    React.useEffect(() => {
        // opening first ranking --> close start menu
        if (ordino.workbenches.length === 1) {
            setMode({ mode: EStartMenuMode.OVERLAY });
            setActiveTab(null);
        }
    }, [ordino.workbenches.length]);
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
        React.createElement(StartMenuTabWrapper, { tabs: props.tabs, activeTab: menu.activeTab, mode: EStartMenuMode.OVERLAY })));
}
//# sourceMappingURL=OrdinoHeader.js.map