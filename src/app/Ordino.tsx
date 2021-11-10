import * as React from 'react';
import {Breadcrumb} from './Breadcrumb';
import {Filmstrip} from './Filmstrip';
import {StartMenuTabWrapper} from '../components/header/menu/StartMenuTabWrapper';
import {useAppSelector} from '../hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function Ordino() {
    const ordino = useAppSelector((state) => state.ordino);
    return (
        <div id="content">
            <main data-anchor = "main" className="targid">
                <DndProvider backend={HTML5Backend}>
                    <StartMenuTabWrapper/>
                    <Breadcrumb />
                    <Filmstrip />
                </DndProvider>
            </main>
        </div>
    );
}
