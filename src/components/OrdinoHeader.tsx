import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderTabs, } from '.';
import {useAppSelector} from '..';
import {setActiveTab, setMode} from '../store';
import {IVisynHeaderProps, VisynHeader} from '../visyn';
import {EStartMenuMode, ITab, StartMenuTabWrapper} from './header/menu/StartMenuTabWrapper';


export interface IOrdinoHeaderProps extends IVisynHeaderProps {
    tabs?: ITab[];
}

export function OrdinoHeader(props: IOrdinoHeaderProps) {

    const ordino = useAppSelector((state) => state.ordino);
    const menu = useAppSelector((state) => state.menu);
    const dispatch = useDispatch();

    React.useEffect(() => {
        // opening first ranking --> close start menu
        if (ordino.workbenches.length === 1) {
            setMode({mode: EStartMenuMode.OVERLAY});
            setActiveTab(null);
        }

    }, [ordino.workbenches.length]);

    React.useEffect(() => {
        if (ordino.workbenches.length === 0) {
            dispatch(setActiveTab(props.tabs[0].id));
        }
    }, [ordino.workbenches.length]);

    return (<>
        <VisynHeader extensions={{
            LeftExtensions: () => <HeaderTabs tabs={props.tabs} activeTab={menu.activeTab} mode={EStartMenuMode.OVERLAY} />,
            ...props.extensions
        }} />
        <StartMenuTabWrapper tabs={props.tabs} activeTab={menu.activeTab} mode={EStartMenuMode.OVERLAY} />
    </>
    );
}
