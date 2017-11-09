

import {IStartMenuSection, IStartMenuSectionDesc, IStartMenuSectionOptions} from '../../extensions';
import {INamedSet} from 'tdp_core/src/storage';
import {TemporarySessionList} from 'tdp_core/src/SessionList';

export default class TemporarySessionSection implements IStartMenuSection {
  constructor(parent: HTMLElement, public readonly desc: IStartMenuSectionDesc, options: IStartMenuSectionOptions) {
    new TemporarySessionList(parent, options.graphManager);
  }

  push(namedSet: INamedSet) {
    return false;
  }
}
