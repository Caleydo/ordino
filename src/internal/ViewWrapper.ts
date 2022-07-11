/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */

import {
  IObjectRef,
  ObjectRefUtils,
  ProvenanceGraph,
  IDType,
  EventHandler,
  IPlugin,
  IPluginDesc,
  INamedSet,
  TDPApplicationUtils,
  AView,
  EViewMode,
  ISelection,
  ViewUtils,
  IView,
  IViewContext,
} from 'tdp_core';
import * as d3v3 from 'd3v3';
import * as $ from 'jquery';
// eslint-disable-next-line import/extensions
import 'jquery.scrollto/jquery.scrollTo.js';
import { MODE_ANIMATION_TIME } from './constants';

function generateHash(desc: IPluginDesc, selection: ISelection) {
  const s = `${selection.idtype ? selection.idtype.id : ''}r${selection.ids}`;
  return `${desc.id}_${s}`;
}

export class ViewWrapper extends EventHandler {
  static EVENT_CHOOSE_NEXT_VIEW = 'open';

  static EVENT_FOCUS = 'focus';

  static EVENT_REMOVE = 'remove';

  static EVENT_MODE_CHANGED = 'modeChanged';

  static EVENT_REPLACE_VIEW = 'replaceView';

  private $viewWrapper: d3v3.Selection<ViewWrapper>;

  private $node: d3v3.Selection<ViewWrapper>;

  private $chooser: d3v3.Selection<ViewWrapper>;

  private _mode: EViewMode = null;

  private instance: IView = null;

  /**
   * Listens to the AView.EVENT_ITEM_SELECT event and decided if the chooser should be visible.
   * Then dispatches the incoming event again (aka bubbles up).
   * @param event
   * @param oldSelection
   * @param newSelection
   */
  private listenerItemSelect = (event: any, oldSelection: ISelection, newSelection: ISelection) => {
    this.chooseNextViews(newSelection.idtype, newSelection.ids);
    this.fire(AView.EVENT_ITEM_SELECT, oldSelection, newSelection);
  };

  /**
   * Forward event from view to app instance
   * @param event
   * @param idtype
   * @param namedSet
   */
  private listenerUpdateEntryPoint = (event: any, namedSet: INamedSet) => {
    this.fire(AView.EVENT_UPDATE_ENTRY_POINT, namedSet);
  };

  /**
   * Wrapper function for event listener
   */
  private scrollIntoViewListener = () => {
    this.scrollIntoView();
  };

  /**
   * Provenance graph reference of this object
   */
  readonly ref: IObjectRef<ViewWrapper>;

  /**
   * Provenance graph context
   */
  context: IViewContext;

  built: PromiseLike<any>;

  /**
   * Initialize this view, create the root node and the (inner) view
   * @param graph
   * @param selection
   * @param itemSelection
   * @param parent
   * @param plugin
   * @param options
   */
  constructor(
    private readonly graph: ProvenanceGraph,
    public selection: ISelection,
    itemSelection: ISelection | null,
    parent: Element,
    private plugin: IPlugin,
    private firstTime: boolean,
    public options?,
  ) {
    super();

    // create provenance reference
    this.ref = graph.findOrAddObject(ObjectRefUtils.objectRef(this, plugin.desc.name, ObjectRefUtils.category.visual, generateHash(plugin.desc, selection)));

    this.init(graph, selection, plugin, options);

    // create ViewWrapper root node
    this.$viewWrapper = d3v3.select(parent).append('div').classed('viewWrapper', true);

    this.built = Promise.resolve(this.createView(selection, itemSelection, plugin, options));
  }

  /**
   * Create provenance reference object (`this.ref`) and the context (`this.context`)
   * @param graph
   * @param selection
   * @param plugin
   * @param options
   */
  private init(graph: ProvenanceGraph, selection: ISelection, plugin: IPlugin, options?) {
    // console.log(graph, generate_hash(plugin.desc, selection, options));

    // create (inner) view context
    this.context = ViewUtils.createContext(graph, plugin.desc, this.ref);
  }

  /**
   * Create the corresponding DOM elements + chooser and the new (inner) view from the given parameters
   * @param selection
   * @param plugin
   * @param options
   */
  private createView(selection: ISelection, itemSelection: ISelection | null, plugin: IPlugin, options?) {
    this.$node = this.$viewWrapper.append('div').classed('view', true).datum(this);

    this.$chooser = this.$viewWrapper
      .append('div')
      .classed('chooser', true)
      .classed('hidden', true) // closed by default --> opened on selection (@see this.chooseNextViews())
      .datum(this);

    const $viewActions = this.$node.append('div').attr('class', 'view-actions');

    $viewActions
      .append('button')
      .attr('type', 'button')
      .attr('class', 'btn-close')
      .attr('aria-label', 'Close')
      .on('click', (d) => {
        this.remove();
      });

    const $params = this.$node.append('div').attr('class', 'parameters container-fluid ps-0 pe-0').datum(this);

    const $inner = this.$node.append('div').classed('inner', true);

    this.instance = plugin.factory(this.context, selection, <Element>$inner.node(), options, plugin.desc);
    return Promise.resolve(this.instance.init(<HTMLElement>$params.node(), this.onParameterChange.bind(this)))
      .then(() => {
        if (itemSelection) {
          return this.instance.setItemSelection(itemSelection);
        }
        return undefined;
      })
      .then(() => {
        this.instance.on(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);
        this.instance.on(AView.EVENT_UPDATE_ENTRY_POINT, this.listenerUpdateEntryPoint);

        this.instance.on(AView.EVENT_LOADING_FINISHED, this.scrollIntoViewListener);
      });
  }

  /**
   * Replace the inner view with a new view, created from the given parameters.
   * Note: Destroys all references and DOM elements of the old view, except the root node of this ViewWrapper
   * @param selection
   * @param plugin
   * @param options
   */
  replaceView(selection: ISelection, itemSelection: ISelection | null, plugin: IPlugin, firstTime: boolean, options?) {
    this.destroyView();

    this.selection = selection;
    this.plugin = plugin;
    this.options = options;
    this.firstTime = firstTime;

    this.init(this.graph, selection, plugin, options);
    this.built = this.createView(selection, itemSelection, plugin, options);
    this.built.then(() => {
      this.fire(ViewWrapper.EVENT_REPLACE_VIEW, this);
    });
    return this.built;
  }

  /**
   * De-attache the event listener to (inner) view, destroys instance and removes the DOM elements
   */
  private destroyView() {
    // un/register listener only for ProxyViews
    this.instance.off(AView.EVENT_LOADING_FINISHED, this.scrollIntoViewListener);
    this.instance.off(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);
    this.instance.off(AView.EVENT_UPDATE_ENTRY_POINT, this.listenerUpdateEntryPoint);
    this.instance.destroy();

    this.$viewWrapper.select('.view').remove();
    this.$chooser.remove();
  }

  /**
   * Destroys the inner view and the ViewWrapper's root node
   */
  destroy() {
    this.destroyView();
    this.$viewWrapper.remove();
  }

  getInstance() {
    return this.instance;
  }

  private onParameterChange(name: string, value: any, previousValue: any, isInitializion: boolean) {
    if (isInitializion) {
      if (this.firstTime) {
        return this.context.graph.pushWithResult(TDPApplicationUtils.setParameter(this.ref, name, value, previousValue), {
          inverse: TDPApplicationUtils.setParameter(this.ref, name, previousValue, value),
        });
      }
      return undefined; // dummy;
    }
    return this.context.graph.push(TDPApplicationUtils.setParameter(this.ref, name, value, previousValue));
  }

  getParameter(name: string) {
    return this.instance.getParameter(name);
  }

  setParameterImpl(name: string, value: any) {
    return this.instance.setParameter(name, value);
  }

  getItemSelection() {
    return this.instance.getItemSelection();
  }

  setItemSelection(sel: ISelection) {
    // turn listener off, to prevent an infinite event loop
    this.instance.off(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);

    return Promise.resolve(this.instance.setItemSelection(sel)).then(() => {
      this.chooseNextViews(sel.idtype, sel.ids);

      // turn listener on again
      this.instance.on(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);
    });
  }

  setParameterSelection(selection: ISelection) {
    if (ViewUtils.isSameSelection(this.selection, selection)) {
      return undefined;
    }
    this.selection = selection;
    return Promise.resolve(this.instance.setInputSelection(selection));
  }

  getParameterSelection() {
    return this.selection;
  }

  matchSelectionLength(length: number) {
    return ViewUtils.matchLength(this.desc.selection, length) || (ViewUtils.showAsSmallMultiple(this.desc) && length > 1);
  }

  protected modeChanged(mode: EViewMode) {
    // update css classes
    this.$viewWrapper
      .classed('t-hide', mode === EViewMode.HIDDEN)
      .classed('t-focus', mode === EViewMode.FOCUS)
      .classed('t-context', mode === EViewMode.CONTEXT)
      .classed('t-active', mode === EViewMode.CONTEXT || mode === EViewMode.FOCUS);
    this.$chooser.classed('t-hide', mode === EViewMode.HIDDEN);

    // trigger modeChanged
    this.instance.modeChanged(mode);

    this.updateAfterAnimation();

    // on focus view scroll into view
    if (mode === EViewMode.FOCUS) {
      this.scrollIntoView();
    }
  }

  private updateAfterAnimation() {
    if (!this.instance || typeof (<any>this.instance).update !== 'function') {
      return;
    }
    setTimeout(() => {
      if (<any>this.instance && typeof (<any>this.instance).update === 'function') {
        (<any>this.instance).update();
      }
    }, MODE_ANIMATION_TIME);
  }

  private scrollIntoView() {
    const prev = (<any>this.$viewWrapper.node()).previousSibling;
    const scrollToPos = prev ? prev.offsetLeft || 0 : 0;
    const $app = $(this.$viewWrapper.node()).parent();
    (<any>$app).scrollTo(scrollToPos, 500, { axis: 'x' });
  }

  /**
   * Decide if a chooser for the next view should be shown and if so, which next views are available
   * @param idtype
   * @param selection
   */
  private chooseNextViews(idtype: IDType, selection: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const isSelNone = selection?.length === 0;
    // show chooser if selection available
    this.$chooser.classed('hidden', isSelNone);

    if (isSelNone) {
      this.$chooser.selectAll('button').classed('active', false);
    }

    ViewUtils.findViews(idtype, selection).then((views) => {
      const groups = ViewUtils.groupByCategory(views);

      const $categories = this.$chooser.selectAll('div.category').data(groups);

      $categories
        .enter()
        .append('div')
        .classed('category', true)
        .append('header')
        .append('h1')
        .text((d) => d.label);
      $categories.exit().remove();

      // sort data that buttons inside groups are sorted
      const $buttons = $categories.selectAll('button').data((d) => d.views);

      $buttons.enter().append('button').classed('btn', true);

      $buttons.attr('data-viewid', (d) => d.id);
      $buttons
        .text((d) => d.name)
        .attr('disabled', (d) => (d.mockup || !d.enabled ? 'disabled' : null))
        .on('click', function (d) {
          $buttons.classed('active', false);
          d3v3.select(this).classed('active', true);

          that.fire(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, d.id, idtype, selection);
        });

      $buttons.exit().remove();
    });
  }

  setActiveNextView(viewId?: string) {
    const chooser = <HTMLElement>this.$chooser.node();
    // disable old don't use d3 to don't screw up the data binding
    Array.from(chooser.querySelectorAll('button.active')).forEach((d: HTMLElement) => d.classList.remove('active'));
    if (viewId) {
      const button = chooser.querySelector(`button[data-viewid="${viewId}"]`);
      if (button) {
        button.classList.add('active');
      }
    }
  }

  get desc() {
    return ViewUtils.toViewPluginDesc(this.plugin.desc);
  }

  get mode() {
    return this._mode;
  }

  set mode(mode: EViewMode) {
    if (this._mode === mode) {
      return;
    }
    const b = this._mode;
    this.modeChanged(mode);
    this.fire(ViewWrapper.EVENT_MODE_CHANGED, (this._mode = mode), b);
  }

  get node() {
    return <Element>this.$node.node();
  }

  remove() {
    this.fire(ViewWrapper.EVENT_REMOVE, this);
  }

  focus() {
    this.fire(ViewWrapper.EVENT_FOCUS, this);
  }

  static createViewWrapper(
    graph: ProvenanceGraph,
    selection: ISelection,
    itemSelection: ISelection | null,
    parent: Element,
    plugin: IPluginDesc,
    firstTime: boolean,
    options?,
  ) {
    return plugin.load().then((p) => new ViewWrapper(graph, selection, itemSelection, parent, p, firstTime, options));
  }

  static replaceViewWrapper(
    existingView: ViewWrapper,
    selection: ISelection,
    itemSelection: ISelection | null,
    plugin: IPluginDesc,
    firstTime: boolean,
    options?,
  ) {
    return plugin.load().then((p) => existingView.replaceView(selection, itemSelection, p, firstTime, options));
  }
}
