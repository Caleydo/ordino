import * as React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Breadcrumb } from './Breadcrumb';
import { Filmstrip } from './Filmstrip';
import { useAppSelector } from '../hooks';

export function Ordino() {
  const ordino = useAppSelector((state) => state.ordino);
  return (
    <div id="content">
      <main data-anchor="main" className="targid">
        <DndProvider backend={HTML5Backend}>
          <Breadcrumb />
          <Filmstrip />
        </DndProvider>
      </main>
    </div>
  );
}
