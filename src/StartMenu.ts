/**
 * Created by Holger Stitz on 27.07.2016.
 */

import * as session from 'phovea_core/src/session';
import {IDType, resolve} from 'phovea_core/src/idtype';
import {areyousure} from 'phovea_ui/src/dialogs';
import {Targid, TargidConstants} from './Targid';
import {listNamedSets, INamedSet, deleteNamedSet} from './storage';
import {IPluginDesc, list as listPlugins, get as getPlugin} from 'phovea_core/src/plugin';
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
const EXTENSION_ID = 'targid_start_species';

interface IStartMenuSection extends IPluginDesc {
  readonly name: string;
  readonly cssClass: string;
}

export interface IEntryPointList {
  getIdType(): IDType | string;
  addNamedSet(namedSet: INamedSet);
  removeNamedSet(namedSet: INamedSet);
}

export interface IStartMenuSectionEntry {
  readonly desc: IPluginDesc;
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
  updateEntryPointList(idType: IDType | string, namedSet: INamedSet) {
    this.entryPoints
      .map((d) => d.getEntryPointLists())
      .filter((d) => d !== null && d !== undefined)
      .reduce((a, b) => a.concat(b), []) // [[0, 1], [2, 3], [4, 5]] -> [0, 1, 2, 3, 4, 5]
      .filter((d) => d.getIdType() === resolve(idType).id)
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

    const sectionEntries = listPlugins(EXTENSION_POINT_ID).map((d) => <IStartMenuSection>d).sort(byPriority);

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
  readonly name: string;
  build(element: HTMLElement);
  options(): Promise<{viewId: string; options: any}>;
}

class StartFactory implements IStartFactory {
  private builder: Promise<() => any> = null;

  constructor(private readonly p: IPluginDesc) {

  }

  get name() {
    return this.p.name;
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

export interface IEntryPointOptions {
  targid?: Targid;
}

/**
 * Abstract entry point list
 */
export class AEntryPointList implements IEntryPointList {

  protected idType = 'Ensembl';

  protected readonly $node;

  protected data: INamedSet[] = [];

  constructor(protected readonly parent: HTMLElement, public readonly desc: IPluginDesc, protected readonly options: IEntryPointOptions) {
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

        this.$node.append('div').classed('header subheader', true);
        this.$node.append('ul').classed('namedSets', true);

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

    const plugin = getPlugin(EXTENSION_POINT_ID, EXTENSION_ID);

    const headerText = plugin.headers[this.getIdType().toLowerCase()];

    this.$node.select('.header.subheader').text(`Predefined ${headerText}`);
    this.$node.append('ul').classed('namedSets', true);

    const predefinedNamedSets = data.filter((d) => d.type !== ENamedSetType.NAMEDSET);
    const customNamedSets = data.filter((d) => d.type === ENamedSetType.NAMEDSET);

    if(this.$node.select('.customNamedSets').empty() && customNamedSets.length > 0) {
      const customNamedSetsNode = this.$node.append('div').classed('customNamedSets', true);
      customNamedSetsNode.append('div').classed('header subheader', true).text(`My ${headerText}`);
      customNamedSetsNode.append('ul');
    } else if(customNamedSets.length === 0) {
      this.$node.select('.customNamedSets').remove();
    }

    // append the list items
    const $ul = this.$node.select('.namedSets');
    const $customNamedSets = this.$node.select('.customNamedSets ul');

    const $options = [$ul.selectAll('li').data(predefinedNamedSets), $customNamedSets.selectAll('li').data(customNamedSets)];
    $options.map((options) => {
      const enter = options.enter()
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

      options.each(function () {
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
          .on('click', async (namedSet: INamedSet) => {
            // prevent changing the hash (href)
            (<Event>d3.event).preventDefault();

            const deleteIt = await areyousure(`The named set <i>${namedSet.name}</i> will be deleted and cannot be restored. Continue?`,
              {title: `Delete named set`}
            );
            if (deleteIt) {
              await deleteNamedSet(namedSet.id);
              that.removeNamedSet(namedSet);
            }
          });
      });

      options.exit().remove();
    });
  }
}
