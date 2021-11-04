import * as React from 'react';
import {Breadcrumb} from './Breadcrumb';
import {Filmstrip} from './Filmstrip';
import {StartMenuTabWrapper} from '../components/header/menu/StartMenuTabWrapper';
import {useAppSelector} from '../hooks';

export function Ordino() {
    const ordino = useAppSelector((state) => state.ordino);
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
