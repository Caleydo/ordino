import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderTabs, } from '.';
import {setActiveTab, setMode} from '../store';
import {IVisynHeaderProps, VisynHeader} from '../visyn';
import {EStartMenuMode, ITab, StartMenuTabWrapper} from './header/menu/StartMenuTabWrapper';


export interface IOrdinoHeaderProps extends IVisynHeaderProps {
    tabs?: ITab[];
}

export function OrdinoHeader(props: IOrdinoHeaderProps) {

    const ordino: any = useSelector<any>((state) => state.ordino) as any;
    const menu: any = useSelector<any>((state) => state.menu) as any;
    const dispatch = useDispatch();

    React.useEffect(() => {
        // opening first ranking --> close start menu
        if (ordino.views.length === 1) {
            setMode({mode: EStartMenuMode.OVERLAY});
            setActiveTab(null);
        }

    }, [ordino.views.length]);

    React.useEffect(() => {
        if (ordino.views.length === 0) {
            dispatch(setActiveTab(props.tabs[0].id));
        }
    }, [ordino.views.length]);

    return (<>
        <VisynHeader extensions={{
            LeftExtensions: () => <HeaderTabs tabs={props.tabs} activeTab={menu.activeTab} mode={EStartMenuMode.OVERLAY} />,
            ...props.extensions
        }} />
        <StartMenuTabWrapper tabs={props.tabs} activeTab={menu.activeTab} mode={EStartMenuMode.OVERLAY} />
    </>
    );
}
