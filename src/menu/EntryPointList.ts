import {INamedSet} from 'tdp_core/src/storage';
import ANamedSetList from 'tdp_core/src/storage/ANamedSetList';
import {IPluginDesc} from 'phovea_core/src/plugin';
import {IStartMenuSection, IStartMenuSectionOptions} from '../extensions';


/**
 * Abstract entry point list
 */
export default class EntryPointList extends ANamedSetList implements IStartMenuSection {
  constructor(parent: HTMLElement, public readonly desc: IPluginDesc, protected readonly options: IStartMenuSectionOptions) {
    super(parent.ownerDocument);
    parent.appendChild(this.node);
  }

  getIdType() {
    return this.idType;
  }

  protected getDefaultSessionValues(): any|null {
    return null;
  }

  private createSession(namedSet: INamedSet) {
    if (this.options.session) {
      this.options.session((<any>this.desc).viewId, {namedSet}, this.getDefaultSessionValues());
    } else {
      console.error('no targid object given to push new view');
    }
  }
}
