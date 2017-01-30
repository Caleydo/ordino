/**
 * Created by Holger Stitz on 27.07.2016.
 */

import * as session from 'phovea_core/src/session';
import * as idtypes from 'phovea_core/src/idtype';
import * as dialogs from 'phovea_ui/src/dialogs';
import {Targid, TargidConstants} from './Targid';
import {listNamedSets, INamedSet, deleteNamedSet} from './storage';
import {IPluginDesc, list as listPlugins} from 'phovea_core/src/plugin';
import {showErrorModalDialog} from './Dialogs';
import * as d3 from 'd3';
import {ENamedSetType} from './storage';

export interface IStartMenuOptions {
  targid: Targid;
}

const template = `
    <button class="closeButton">
      <i class="fa fa-times" aria-hidden="true"></i>
      <span class="sr-only">Close</span>
    </button>
    <div class="menu"></div>
  `;

export const EXTENSION_POINT_ID = 'targidStartMenuSection';

interface IStartMenuSection extends IPluginDesc {
  name: string;
  cssClass: string;
}

export interface IEntryPointList {
  getIdType(): idtypes.IDType | string;
  addNamedSet(namedSet: INamedSet);
  removeNamedSet(namedSet: INamedSet);
}

export interface IStartMenuSectionEntry {
  desc: IPluginDesc;
  getEntryPointLists(): IEntryPointList[];
}

export class StartMenu {

  protected readonly $node;
  private readonly targid: Targid;
  private entryPoints: IStartMenuSectionEntry[] = [];
  protected $sections;

  /**
   * Save an old key down listener to restore it later
   */
  private restoreKeyDownListener: (ev: KeyboardEvent) => any;

  constructor(parent: Element, options: IStartMenuOptions) {
    this.$node = d3.select(parent);
    this.targid = options.targid;
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
  private updateEntryPointList(idType: idtypes.IDType | string, namedSet: INamedSet) {
    this.entryPoints
      .map((d) => d.getEntryPointLists())
      .filter((d) => d !== null && d !== undefined)
      .reduce((a, b) => a.concat(b), []) // [[0, 1], [2, 3], [4, 5]] -> [0, 1, 2, 3, 4, 5]
      .filter((d) => d.getIdType() === idtypes.resolve(idType).id)
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

    this.$node.select('.closeButton').on('click', (d) => {
      // prevent changing the hash (href)
      (<Event>d3.event).preventDefault();

      this.close();
    });

    const sectionEntries = listPlugins(EXTENSION_POINT_ID).map((d) => <IStartMenuSection>d).sort(byPriority);

    this.$sections = this.$node.select('.menu').selectAll('section').data(sectionEntries);

    this.$sections.enter()
      .append('section')
      .attr('class', (d) => d.cssClass)
      .html((d, i) => `
        <header><h1><label for="${d.cssClass}Toggle">${d.name}</label></h1></header>
        <input id="${d.cssClass}Toggle" class="toggle" type="radio" name="toggle" ${i === 0 ? 'checked="checked"': ''} />
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

    this.$sections.each(function() {
      // reload the entry points every time the
      d3.select(this).selectAll('div.body')
        .each(function (section: IStartMenuSection) {

          // do not load entry point again, if already loaded
          if (that.hasEntryPoint(section)) {
            return;
          }

          const elem = this;
          section.load()
            .then((i) => i.factory(elem, section, { targid: that.targid}))
            .then((entryPoint) => {
              // prevent adding the entryPoint if already in list or undefined
              if (entryPoint === undefined || that.hasEntryPoint(section)) {
                return;
              }
              that.entryPoints.push(entryPoint);
            })
            .catch(showErrorModalDialog);
        });
    });
  }

}

function byPriority(a: any, b: any) {
  return (a.priority || 10) - (b.priority || 10);
}

export function create(parent: Element, options?) {
  return new StartMenu(parent, options);
}


export interface IStartFactory {
  name: string;
  build(element: HTMLElement);
  options(): Promise<{viewId: string; options: any}>;
}

class StartFactory implements IStartFactory {
  private builder: Promise<() => any> = null;

  constructor(private p: IPluginDesc) {

  }

  get name() {
    return this.p.name;
  }

  build(element: HTMLElement, options :IEntryPointOptions = {}) {
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
  const plugins = listPlugins(type).sort((a: any, b: any) => (a.priority || 10) - (b.priority || 10));
  return plugins.map((p: IPluginDesc) => new StartFactory(p));
}

export interface IEntryPointOptions {
  targid?: Targid;
}

/**
 * Abstract entry point list
 */
export class AEntryPointList implements IEntryPointList {

  protected idType = 'Ensembl';

  protected $node;

  protected data: INamedSet[] = [];

  constructor(protected parent: HTMLElement, public desc: IPluginDesc, protected options: IEntryPointOptions) {
    this.$node = d3.select(parent);
  }

  public getIdType() {
    return this.idType;
  }

  /**
   * Add a single named set to this entry point list
   * @param namedSet
   */
  addNamedSet(namedSet: INamedSet) {
    this.data.push(namedSet);
    this.updateList(this.data);
  }

  removeNamedSet(namedSet: INamedSet) {
    this.data.splice(this.data.indexOf(namedSet), 1);
    this.updateList(this.data);
  }

  protected getNamedSets(): Promise<INamedSet[]> {
    return listNamedSets(this.idType);
  }

  protected build(): Promise<INamedSet[]> {
    // load named sets (stored LineUp sessions)
    const promise = this.getNamedSets()
    // on success
      .then((namedSets: INamedSet[]) => {
        this.$node.html(''); // remove loading element or previous data

        // convert to data format and append to species data
        this.data.push(...namedSets);

        this.$node.append('ul');
        this.updateList(this.data);

        return namedSets;
      });

    // on error
    promise.catch(showErrorModalDialog)
      .catch((error) => {
        console.error(error);
      });

    return promise;
  }

  /**
   * Update the HTML list for this entry point.
   * Also binds the click listener that saves the selection to the session, before reloading the page
   * @param data
   */
  private updateList(data: INamedSet[]) {
    const that = this;

    // append the list items
    const $ul = this.$node.select('ul');
    const $options = $ul.selectAll('li').data(data);
    const enter = $options.enter()
      .append('li')
      .classed('namedset', (d) => d.type === ENamedSetType.NAMEDSET);

    enter.append('a')
      .classed('goto', true)
      .attr('href', '#');

    enter.append('a')
      .classed('delete', true)
      .attr('href', '#')
      .html(`<i class="fa fa-trash" aria-hidden="true"></i> <span class="sr-only">Delete</span>`)
      .attr('title', 'Delete');

    $options.each(function () {
      const $this = d3.select(this);
      $this.select('a.goto')
        .text((d: any) => d.name.charAt(0).toUpperCase() + d.name.slice(1))
        .on('click', (namedSet: INamedSet) => {
          // prevent changing the hash (href)
          (<Event>d3.event).preventDefault();

          // if targid object is available
          if (that.options.targid) {
            // store state to session before creating a new graph
            session.store(TargidConstants.NEW_ENTRY_POINT, {
              view: (<any>that.desc).viewId,
              options: {
                namedSet
              }
            });

            // create new graph and apply new view after window.reload (@see targid.checkForNewEntryPoint())
            that.options.targid.graphManager.newRemoteGraph();
          } else {
            console.error('no targid object given to push new view');
          }
        });

      $this.select('a.delete')
        .classed('hidden', (d) => d.type !== ENamedSetType.NAMEDSET)
        .on('click', (namedSet: INamedSet) => {
          // prevent changing the hash (href)
          (<Event>d3.event).preventDefault();

          dialogs.areyousure(
            `The named set <i>${namedSet.name}</i> will be deleted and cannot be restored. Continue?`,
            {title: `Delete named set`}
          )
            .then((deleteIt) => {
              if (deleteIt) {
                deleteNamedSet(namedSet.id)
                  .then(() => {
                    that.removeNamedSet(namedSet);
                  });
              }
            });

        });
    });

    $options.exit().remove();
  }
}
