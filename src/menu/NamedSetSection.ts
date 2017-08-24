/**
 * Created by Holger Stitz on 27.07.2016.
 */

import {IDType, resolve} from 'phovea_core/src/idtype';
import {areyousure} from 'phovea_ui/src/dialogs';
import {Targid} from '../Targid';
import {listNamedSets, INamedSet, deleteNamedSet, editNamedSet, IStoredNamedSet, editDialog, ENamedSetType} from 'tdp_core/src/storage';
import {IPluginDesc, list as listPlugins} from 'phovea_core/src/plugin';
import {showErrorModalDialog} from 'tdp_core/src/dialogs';
import * as d3 from 'd3';
import {ALL_NONE_NONE, ALL_READ_READ, canWrite, currentUserNameOrAnonymous, EEntity,  hasPermission} from 'phovea_core/src/security';
import TargidConstants from '../constants';
import {IStartMenuSection, EXTENSION_POINT_START_MENU} from '../extensions';

export interface IStartMenuOptions {
  targid: Targid;
}

const template = `<button class="closeButton">
      <i class="fa fa-times" aria-hidden="true"></i>
      <span class="sr-only">Close</span>
    </button>
    <div class="menu"></div>`;

export default class StartMenu {

  private readonly $node: d3.Selection<any>;
  private entryPoints: IStartMenuSection[] = [];
  protected $sections;

  /**
   * Save an old key down listener to restore it later
   */
  private restoreKeyDownListener: (ev: KeyboardEvent) => any;

  constructor(parent: Element, private readonly targid: Targid) {
    this.$node = d3.select(parent);
    this.build();
  }

  /**
   * Opens the start menu and attaches an key down listener, to close the menu again pressing the ESC key
   */
  open() {
    this.restoreKeyDownListener = document.onkeydown;
    document.onkeydown = (evt) => {
      evt = evt || <KeyboardEvent>window.event;
      if (evt.keyCode === 27) {
        this.close();
      }
    };
    this.$node.classed('open', true);

    this.updateSections();
  }

  /**
   * Close the start menu and restore an old key down listener
   */
  close() {
    document.onkeydown = this.restoreKeyDownListener;
    this.$node.classed('open', false);
  }

  /**
   * Update entry point list for a given idType and an additional namedSet that should be appended
   * @param idType
   * @param namedSet
   */
  updateEntryPointList(idType: IDType | string, namedSet: INamedSet) {
    const resolved = resolve(idType);
    this.entryPoints
      .map((d) => d.getEntryPointLists())
      .filter((d) => d !== null && d !== undefined)
      .reduce((a, b) => a.concat(b), []) // [[0, 1], [2, 3], [4, 5]] -> [0, 1, 2, 3, 4, 5]
      .filter((d) => d.getIdType() === resolved.id)
      .forEach((d) => {
        d.addNamedSet(namedSet);
      });
  }

  /**
   * Build multiple sections with entries grouped by database
   */
  private build() {
    const that = this;

    this.$node.html(template);

    this.$node.on('click', () => {
      if ((<Event>d3.event).currentTarget === (<Event>d3.event).target) {
        this.close();
      }
    });

    this.$node.select('.closeButton').on('click', () => {
      // prevent changing the hash (href)
      (<Event>d3.event).preventDefault();

      this.close();
    });

    const sectionEntries = listPlugins(EXTENSION_POINT_START_MENU).map((d) => <IStartMenuSection>d).sort(byPriority);

    this.$sections = this.$node.select('.menu').selectAll('section').data(sectionEntries);

    this.$sections.enter()
      .append('section')
      .attr('class', (d) => d.cssClass)
      .html((d, i) => `
        <header><h1><label for="${d.cssClass}Toggle">${d.name}</label></h1></header>
        <input id="${d.cssClass}Toggle" class="toggle" type="radio" name="toggle" ${i === 0 ? 'checked="checked"' : ''} />
        <main>
            <div class="item">
              <div class="body">
                <div class="loading">
                  <i class="fa fa-spinner fa-pulse fa-fw"></i>
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
        </main>
      `);

    // do not update here --> will be done on first call of open()
    //this.updateSections();
  }

  private hasEntryPoint(section: IStartMenuSection) {
    // do not load entry point again, if already loaded
    return this.entryPoints.find((ep) => ep.desc.id === section.id) != null;
  }

  /**
   * Loops through all sections and updates them (or the entry points) if necessary
   */
  private updateSections() {
    const that = this;

    this.$sections.each(async function (section: IStartMenuSection) {
      // reload the entry points every time the
      const elem = <HTMLElement>d3.select(this).select('div.body').node();

      // do not load entry point again, if already loaded
      if (that.hasEntryPoint(section)) {
        return;
      }

      const entryPoint = (await section.load()).factory(elem, section, {targid: that.targid});
      // prevent adding the entryPoint if already in list or undefined
      if (entryPoint === undefined || that.hasEntryPoint(section)) {
        return;
      }
      that.entryPoints.push(entryPoint);
    });
  }

}

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
