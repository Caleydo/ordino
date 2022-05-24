import * as React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { Filmstrip } from './Filmstrip';

export function Ordino() {
  return (
    <div id="content">
      <main data-anchor="main" className="targid">
        <Breadcrumb />
        <Filmstrip />
      </main>
    </div>
  );
}
