import {IPluginDesc, list as listPlugins} from 'phovea_core/src/plugin';
import {IEntryPointOptions} from './EntryPointList';

function byPriority(a: any, b: any) {
  return (a.priority || 10) - (b.priority || 10);
}


export interface IStartFactory {
  readonly id: string;
  readonly name: string;
  readonly cssClass: string;
  readonly idType: string;
  readonly description: string;
  build(element: HTMLElement);
  options(): Promise<{viewId: string; options: any}>;
}

class StartFactory implements IStartFactory {
  private builder: Promise<() => any> = null;

  constructor(private readonly p: IPluginDesc) {

  }

  get id() {
    return this.p.id;
  }

  get name() {
    return this.p.name;
  }

  get cssClass() {
    return this.p.cssClass;
  }

  get idType() {
    return this.p.idtype;
  }

  get description() {
    return this.p.description;
  }

  build(element: HTMLElement, options: IEntryPointOptions = {}) {
    return this.builder = this.p.load().then((i) => {
      if (i.factory) {
        return i.factory(element, this.p, options);
      } else {
        console.log(`No viewId and/or factory method found for '${i.desc.id}'`);
        return null;
      }
    });
  }

  options() {
    return this.builder.then((i) => ({viewId: (<any>this.p).viewId, options: i()}));
  }
}


export function findViewCreators(type: string): IStartFactory[] {
  const plugins = listPlugins(type).sort(byPriority);
  return plugins.map((p: IPluginDesc) => new StartFactory(p));
}
