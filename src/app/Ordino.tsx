import * as React from 'react';
import {Breadcrumb} from './Breadcrumb';
import {Filmstrip} from './Filmstrip';
import {useSelector} from 'react-redux';
import {IOrdinoAppState} from '../store/ordinoSlice';
import {StartMenuTabWrapper} from '../components/header/menu/StartMenuTabWrapper';

export function Ordino() {
    const ordino: IOrdinoAppState = useSelector<any>((state) => state.ordino) as IOrdinoAppState;
    return (
        <div id="content">
            <main data-anchor = "main" className="targid">
                <StartMenuTabWrapper/>
                <Breadcrumb />
                <Filmstrip />
            </main>
        </div>
    );
}
