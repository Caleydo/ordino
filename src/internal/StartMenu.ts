/********************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ********************************************************************/


import OrdinoApp from './OrdinoApp';
import {INamedSet} from 'tdp_core';
import {PluginRegistry} from 'phovea_core';
import {event as d3event, select, selection, Selection} from 'd3';
import {EXTENSION_POINT_START_MENU, IStartMenuSection, IStartMenuSectionDesc} from '../extensions';

function byPriority(a: any, b: any) {
  return (a.priority || 10) - (b.priority || 10);
}

const template = `<button class="closeButton">
      <i class="fa fa-times" aria-hidden="true"></i>
      <span class="sr-only">Close</span>
    </button>
    <div class="menu"></div>`;

export default class StartMenu {

  private readonly $node: Selection<any>;
  private sections: IStartMenuSection[] = [];
  private $sections: selection.Update<IStartMenuSectionDesc>;

  /**
   * Save an old key down listener to restore it later
   */
  private restoreKeyDownListener: (ev: KeyboardEvent) => any;

  constructor(parent: Element, private readonly app: OrdinoApp) {
    this.$node = select(parent);
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
   * @param namedSet
   */
  pushNamedSet(namedSet: INamedSet) {
    this.sections.forEach((s) => s.push(namedSet));
  }

  /**
   * Build multiple sections with entries grouped by database
   */
  private build() {
    const that = this;

    this.$node.html(template);

    this.$node.on('click', () => {
      if ((<Event>d3event).currentTarget === (<Event>d3event).target) {
        this.close();
      }
    });

    this.$node.select('.closeButton').on('click', () => {
      // prevent changing the hash (href)
      (<Event>d3event).preventDefault();

      this.close();
    });

    const sectionEntries = PluginRegistry.getInstance().listPlugins(EXTENSION_POINT_START_MENU).map((d) => <IStartMenuSectionDesc>d).sort(byPriority);

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

  private hasSection(desc: IStartMenuSectionDesc) {
    return this.sections.some((s) => s.desc.id === desc.id);
  }

  /**
   * Loops through all sections and updates them (or the entry points) if necessary
   */
  private updateSections() {
    const that = this;

    const options = {
      session: this.app.initNewSession.bind(this.app),
      graphManager: this.app.graphManager
    };

    this.$sections.each(function (desc: IStartMenuSectionDesc) {
      // reload the entry points every time the
      const elem = <HTMLElement>this.querySelector('div.body');

      // do not load entry point again, if already loaded
      // i.e. when the StartMenu is opened again and sections are already initialized
      if (that.hasSection(desc)) {
        return;
      }

      desc.load().then((plugin) => {
        elem.innerHTML = '';
        const section = plugin.factory(elem, desc, options);
        // prevent adding the entryPoint if already in list or undefined
        if (section === undefined || that.hasSection(desc)) {
          return;
        }
        that.sections.push(section);
      });
    });

    // update sections when opening the StartMenu
    this.sections.forEach((section) => {
      if (typeof section.update === 'function') {
        section.update();
      }
    });
  }

}
