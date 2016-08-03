/**
 * Created by Holger Stitz on 27.07.2016.
 */

import session = require('../targid2/TargidSession');
import idtypes = require('../caleydo_core/idtype');
import {findViewCreators, IView} from './View';
import {Targid, TargidConstants} from './Targid';
import {listNamedSets, INamedSet} from '../targid2/storage';
import {IPluginDesc} from '../caleydo_core/plugin';


export class StartMenu {

  protected $node:d3.Selection<IView>;

  private targid:Targid;

  private template = `
    <button class="closeButton">
      <i class="fa fa-times" aria-hidden="true"></i>
      <span class="sr-only">Close</span>
    </button>
    <div class="menu">
      <section class="entryPoints">
        <header><h1>Entry Points</h1></header>
        <main></main>
      </section>
      <section class="lineUpData">
        <header><h1>LineUp Data Sets</h1></header>
        <main></main>
      </section>
      <section class="targidSessionData">
        <header><h1>Sessions</h1></header>
        <main></main>
       </section>
    </div>
  `;

  /**
   * Save an old key down listener to restore it later
   */
  private restoreKeyDownListener;

  constructor(parent:Element, options?) {
    this.$node = d3.select(parent);
    this.targid = options.targid;
    this.build();
  }

  /**
   * Opens the start menu and attaches an key down listener, to close the menu again pressing the ESC key
   */
  public open() {
    this.restoreKeyDownListener = document.onkeydown;
    document.onkeydown = (evt) => {
      evt = evt || <KeyboardEvent>window.event;
      if (evt.keyCode === 27) {
        this.close();
      }
    };
    this.$node.classed('open', true);
  }

  /**
   * Close the start menu and restore an old key down listener
   */
  public close() {
    document.onkeydown = this.restoreKeyDownListener;
    this.$node.classed('open', false);
  }

  /**
   * Build multiple sections with entries grouped by database
   */
  private build() {
    this.$node.html(this.template);

    this.$node.on('click', () => {
      if((<Event>d3.event).currentTarget === (<Event>d3.event).target) {
        this.close();
      }
    });

    this.$node.select('.closeButton').on('click', (d) => {
      // prevent changing the hash (href)
      (<Event>d3.event).preventDefault();

      this.close();
    });

    this.createSection('targidStartEntryPoint', this.$node.select('.entryPoints main'), true);

    this.createSection('targidStartLineUp', this.$node.select('.lineUpData main'));

    this.createSection('targidStartSession', this.$node.select('.targidSessionData main'));
  }

  private createSection(viewType, $sectionNode, showViewName = false) {
    const that = this;

    // get start views for entry points and sort them by name ASC
    const views = findViewCreators(viewType).sort((a,b) => {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      return x === y ? 0 : (x < y ? -1 : 1);
    });

    const $items = $sectionNode.selectAll('.item').data(views);
    const $enter = $items.enter().append('div').classed('item', true);

    if(showViewName) {
      $enter.append('div').classed('header', true).text((d) => d.name);
    }

    $enter.append('div').classed('body', true)
      .html(`
        <div class="loading">
          <i class="fa fa-spinner fa-pulse fa-fw"></i>
          <span class="sr-only">Loading...</span>
        </div>
      `)
      .each(function(d:any) {
        // provide targid object as option object
        d.build(this, {targid: that.targid});//.then(() => { console.log(arguments); });
      });
  }

}

export function create(parent:Element, options?) {
  return new StartMenu(parent, options);
}


export interface IEntryPointList {
  getIdType():idtypes.IDType | string;
  addNamedSet(namedSet:INamedSet);
}

/**
 * Abstract entry point list
 */
export class AEntryPointList implements IEntryPointList {

  protected idType = 'Ensembl';

  protected $node;

  protected data:any[] = [];

  constructor(protected parent: HTMLElement, protected desc: IPluginDesc, protected options:any) {
    this.$node = d3.select(parent);
  }

  public getIdType() {
    return this.idType;
  }

  /**
   * Add a single named set to this entry point list
   * @param namedSet
   */
  public addNamedSet(namedSet:INamedSet) {
    this.data.push(this.convertNamedSet(namedSet));
    this.updateList(this.data);
  }

  protected build():Promise<INamedSet[]> {
    // load named sets (stored LineUp sessions)
    return listNamedSets(this.idType).then((namedSets: INamedSet[]) => {
      this.$node.html(''); // remove loading element or previous data

      // convert to data format and append to species data
      this.data.push.apply(this.data, namedSets.map((d) => this.convertNamedSet(d)));

      this.$node.append('ul');
      this.updateList(this.data);

      return namedSets;
    });
  }

  /**
   * Convert a given INamedSet into the d3 updateList function
   * @param d
   * @returns {{type: string, v: string, ids: string}}
   */
  private convertNamedSet(d:INamedSet) {
    return { type: 'set', v: d.name, ids: d.ids};
  }

  /**
   * Update the HTML list for this entry point.
   * Also binds the click listener that saves the selection to the session, before reloading the page
   * @param data
   */
  private updateList(data) {
    // append the list items
    const $ul = this.$node.select('ul');
    const $options = $ul.selectAll('li').data(data);
    $options.enter()
      .append('li')
      //.classed('selected', (d,i) => (i === 0))
      .append('a')
      .attr('href', '#')
      .text((d:any) => d.v.charAt(0).toUpperCase() + d.v.slice(1))
      .on('click', (d:any) => {
        // prevent changing the hash (href)
        (<Event>d3.event).preventDefault();

        // if targid object is available
        if(this.options.targid) {
          // create options for new view
          let o = {};
          if(d.type === 'species') {
            o = { species: d.v};
          } else if(d.type === 'set') {
            o = { filterName: d.name, filter: d.ids};
          }

          // store state to session before creating a new graph
          session.store(TargidConstants.NEW_ENTRY_POINT, {
            view: (<any>this.desc).viewId,
            options: o
          });

          // create new graph and apply new view after window.reload (@see targid.checkForNewEntryPoint())
          this.options.targid.graphManager.newGraph();
        } else {
          console.error('no targid object given to push new view');
        }
      });
  }
}
