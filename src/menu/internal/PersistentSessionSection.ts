import {IStartMenuSection, IStartMenuSectionDesc, IStartMenuSectionOptions} from '../../extensions';
import {INamedSet} from 'tdp_core/src/storage';
import {PersistentSessionList} from 'tdp_core/src/SessionList';

export default class TemporarySessionSection implements IStartMenuSection {
  constructor(parent: HTMLElement, public readonly desc: IStartMenuSectionDesc, options: IStartMenuSectionOptions) {
    new PersistentSessionList(parent, options.graphManager);
  }

  push(namedSet: INamedSet) {
    return false;
  }
}
