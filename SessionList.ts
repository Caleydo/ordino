/**
 * Created by Holger Stitz on 27.07.2016.
 */

import {IPluginDesc} from '../caleydo_core/plugin';


export function createStartFactory(parent: HTMLElement, desc: IPluginDesc, options:any) {
  const template = `<table class="table table-striped table-hover table-bordered">
    <thead>
      <tr>
        <th>Entity Type</th>
        <th>Name</th>
        <th>Date</th>
        <th>Creator</th>
      </tr>
    </thead>
    <tbody>

    </tbody>
  </table>`;

  const $parent = d3.select(parent);
  $parent.html(template);
}
