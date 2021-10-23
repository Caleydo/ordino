import * as React from 'react';
import {Breadcrumb} from './Breadcrumb';
import {Filmstrip} from './Filmstrip';
import {useSelector} from 'react-redux';
import {IOrdinoAppState} from '../store/ordinoSlice';

export function Ordino() {
    const ordino: IOrdinoAppState = useSelector<any>((state) => state.ordino) as IOrdinoAppState;
    return (
        <div id="content">
            <Breadcrumb />
            <Filmstrip />
        </div>
    );
}
