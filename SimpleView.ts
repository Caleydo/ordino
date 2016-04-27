/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import {AView, EViewMode, IViewContext, ISelection} from './View';

export class SimpleView extends AView {
  constructor(context: IViewContext, selection: ISelection, parent: Element, options?) {
    super(context, parent, options);
    this.$node.classed('simple', true);

    this.changeSelection(selection);

  }

  changeSelection(selection: ISelection) {
    selection.idtype.unmap(selection.range).then((names) => {
      this.$node.html(`
      <p>
        <div>IDType: ${selection.idtype}</div>
        <div>Selection: ${selection.range}</div>
        <div>Selection: ${names}</div>
      </p>`);
    });
  }

  modeChanged(mode: EViewMode) {
    super.modeChanged(mode);
    this.$node.select('div').text('Test ' + mode);
  }
}



export function create(context: IViewContext, selection: ISelection, parent: Element, options?) {
  return new SimpleView(context, selection, parent, options);
}

