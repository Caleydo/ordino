/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import {ProvenanceGraph, IObjectRef, ref, cat} from 'phovea_core/src/provenance';
import {IDType} from 'phovea_core/src/idtype';
import {Range} from 'phovea_core/src/range';
import * as d3 from 'd3';
import * as $ from 'jquery';
import 'jquery.scrollto/jquery.scrollTo.js';
import {EventHandler} from 'phovea_core/src/event';
import {IPluginDesc, IPlugin, list as listPlugins} from 'phovea_core/src/plugin';
import {INamedSet} from 'tdp_core/src/storage';
import {setParameter} from 'tdp_core/src/cmds';
import {
  AView, createContext, EViewMode, findViews, ISelection, isSameSelection, IView, IViewContext, IViewPluginDesc,
  matchLength,  showAsSmallMultiple, toViewPluginDesc
} from 'tdp_core/src/views';
import {resolveImmediately} from 'phovea_core/src/internal/promise';

function generate_hash(desc: IPluginDesc, selection: ISelection) {
  const s = (selection.idtype ? selection.idtype.id : '')+'r' + (selection.range.toString());
  return desc.id+'_'+s;
}

export default class ViewWrapper extends EventHandler {
  static EVENT_CHOOSE_NEXT_VIEW = 'open';
  static EVENT_FOCUS = 'focus';
  static EVENT_REMOVE = 'remove';

  private $viewWrapper:d3.Selection<ViewWrapper>;
  private $node:d3.Selection<ViewWrapper>;
  private $chooser:d3.Selection<ViewWrapper>;

  private _mode:EViewMode = null;

  private instance:IView = null;

  /**
   * Listens to the AView.EVENT_ITEM_SELECT event and decided if the chooser should be visible.
   * Then dispatches the incoming event again (aka bubbles up).
   * @param event
   * @param oldSelection
   * @param newSelection
   */
  private listenerItemSelect = (event: any, oldSelection: ISelection, newSelection: ISelection) => {
    this.chooseNextViews(newSelection.idtype, newSelection.range);
    this.fire(AView.EVENT_ITEM_SELECT, oldSelection, newSelection);
  }

  /**
   * Forward event from view to Targid instance
   * @param event
   * @param idtype
   * @param namedSet
   */
  private listenerUpdateEntryPoint = (event: any, namedSet: INamedSet) => {
    this.fire(AView.EVENT_UPDATE_ENTRY_POINT, namedSet);
  }

  /**
   * Wrapper function for event listener
   */
  private scrollIntoViewListener = () => {
    this.scrollIntoView();
  }

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
   * @param parent
   * @param plugin
   * @param options
   */
  constructor(private readonly graph: ProvenanceGraph, public selection: ISelection, parent:Element, private plugin:IPlugin, public options?) {
    super();

    // create provenance reference
    this.ref = ref(this, plugin.desc.name, cat.visual, generate_hash(plugin.desc, selection));

    this.init(graph, selection, plugin, options);

    // create ViewWrapper root node
    this.$viewWrapper = d3.select(parent).append('div').classed('viewWrapper', true);

    this.built = resolveImmediately(this.createView(selection, plugin, options));
  }

  /**
   * Create provenance reference object (`this.ref`) and the context (`this.context`)
   * @param graph
   * @param selection
   * @param plugin
   * @param options
   */
  private init(graph: ProvenanceGraph, selection: ISelection, plugin:IPlugin, options?) {

    //console.log(graph, generate_hash(plugin.desc, selection, options));

    // create (inner) view context
    this.context = createContext(graph, plugin.desc, this.ref);
  }

  /**
   * Create the corresponding DOM elements + chooser and the new (inner) view from the given parameters
   * @param selection
   * @param plugin
   * @param options
   */
  private createView(selection: ISelection, plugin:IPlugin, options?) {
    this.$node = this.$viewWrapper.append('div')
      .classed('view', true)
      .datum(this);

    this.$chooser = this.$viewWrapper.append('div')
      .classed('chooser', true)
      .classed('hidden', true) // closed by default --> opened on selection (@see this.chooseNextViews())
      .datum(this);

    this.$node.append('button')
      .attr('type', 'button')
      .attr('class', 'close')
      .attr('aria-label','Close')
      .html(`<span aria-hidden="true">×</span>`)
      .on('click', (d) => {
        this.remove();
      });

    const $params = this.$node.append('div')
      .attr('class', 'parameters form-inline')
      .datum(this);

    const $inner = this.$node.append('div')
      .classed('inner', true);

    this.instance = plugin.factory(this.context, selection, <Element>$inner.node(), options, plugin.desc);
    return resolveImmediately(this.instance.init(<HTMLElement>$params.node(), this.onParameterChange.bind(this))).then(() => {
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
  replaceView(selection: ISelection, plugin:IPlugin, options?) {
    this.destroyView();

    this.selection = selection;
    this.plugin = plugin;
    this.options = options;

    this.init(this.graph, selection, plugin, options);
    return this.built = this.createView(selection, plugin, options);
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


  private onParameterChange(name: string, value: any) {
    return this.context.graph.push(setParameter(this.ref, name, value));
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

    this.instance.setItemSelection(sel);

    this.chooseNextViews(sel.idtype, sel.range);

    // turn listener on again
    this.instance.on(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);
  }

  setParameterSelection(selection: ISelection) {
    if (isSameSelection(this.selection, selection)) {
      return;
    }

    this.instance.setInputSelection(selection);
  }

  getParameterSelection() {
    return this.selection;
  }

  matchSelectionLength(length: number) {
    return matchLength(this.desc.selection, length) ||(showAsSmallMultiple(this.desc) && length > 1);
  }

  set mode(mode:EViewMode) {
    if (this._mode === mode) {
      return;
    }
    const b = this._mode;
    this.modeChanged(mode);
    this.fire('modeChanged', this._mode = mode, b);
  }

  protected modeChanged(mode:EViewMode) {
    // update css classes
    this.$viewWrapper
      .classed('t-hide', mode === EViewMode.HIDDEN)
      .classed('t-focus', mode === EViewMode.FOCUS)
      .classed('t-context', mode === EViewMode.CONTEXT)
      .classed('t-active', mode === EViewMode.CONTEXT || mode === EViewMode.FOCUS);
    this.$chooser
      .classed('t-hide', mode === EViewMode.HIDDEN);

    // trigger modeChanged
    this.instance.modeChanged(mode);

    // on focus view scroll into view
    if(mode === EViewMode.FOCUS) {
      this.scrollIntoView();
    }
  }

  private scrollIntoView() {
    const prev = (<any>this.$viewWrapper.node()).previousSibling;
    const scrollToPos = prev ? prev.offsetLeft || 0 : 0;
    const $targid = $(this.$viewWrapper.node()).parent();
    (<any>$targid).scrollTo(scrollToPos, 500, {axis:'x'});
  }

  /**
   * Decide if a chooser for the next view should be shown and if so, which next views are available
   * @param idtype
   * @param range
   */
  private chooseNextViews(idtype: IDType, range: Range) {
    const that = this;

    // show chooser if selection available
    this.$chooser.classed('hidden', range.isNone);

    if(range.isNone) {
      this.$chooser.selectAll('button').classed('active', false);
    }

    findViews(idtype, range).then((views) => {
      const groups = new Map();
      views.forEach((elem) => {
        if(!elem.v.group) { // fallback category if none is present
          elem.v.group = {
            name: 'Other'
          };
        }
        if(!groups.has(elem.v.group.name)) {
          groups.set(elem.v.group.name, [elem]);
        } else {
          groups.get(elem.v.group.name).push(elem);
        }
      });

      const groupsArray = Array.from(groups);

      const orderDescs = listPlugins('chooserConfig').map((desc) => desc.order);

      function orderAlphabetically(a: string, b: string): number {
        const firstKey = a.toLowerCase();
        const secondKey = b.toLowerCase();

        // firstKey alphabetically before secondKey? sort firstKey at lower index or vice versa
        // else the keys are equal
        return firstKey < secondKey? -1 : firstKey > secondKey? 1 : 0;
      }

      let sortedGroups = null;
      // order groups by defined weights if they exist
      if(orderDescs.length) {
        const categoryOrder = Object.assign({}, ...orderDescs);
        sortedGroups = groupsArray.sort((a, b) => {
          const firstOrder: number = categoryOrder[a[0]];
          const secondOrder: number = categoryOrder[b[0]];

          // no order numbers provided -> sort alphabetically by keys
          if(firstOrder === undefined || secondOrder === undefined || firstOrder === secondOrder) {
            return orderAlphabetically(a[0], b[0]);
          }

          return firstOrder - secondOrder;
        });
      } else {
        // order groups alphabetically as a fallback
        sortedGroups = groupsArray.sort((a, b) => orderAlphabetically(a[0], b[0]));
      }

      const $categories = this.$chooser.selectAll('div.category').data(sortedGroups);

      $categories.enter().append('div').classed('category', true).append('header').append('h1').text((d) => d[0]);
      $categories.exit().remove();

      // sort data that buttons inside groups are sorted
      const $buttons = $categories.selectAll('button').data((d: [ string, {enabled: boolean, v: IViewPluginDesc}[] ]) => d[1].sort((a, b) => {
        const firstOrder: number = a.v.group.order;
        const secondOrder: number = b.v.group.order;

        // no order numbers provided -> sort alphabetically by keys
        if(firstOrder === undefined || secondOrder === undefined || firstOrder === secondOrder) {
          return orderAlphabetically(a.v.name, b.v.name);
        }

        return firstOrder - secondOrder;
      }));

      $buttons.enter().append('button')
        .classed('btn btn-default', true);

      $buttons.attr('data-viewid', (d) => d.v.id);
      $buttons.text((d) => d.v.name)
        .attr('disabled', (d) => d.v.mockup || !d.enabled ? 'disabled' : null)
        .on('click', function(d) {
          $buttons.classed('active', false);
          d3.select(this).classed('active', true);

          that.fire(ViewWrapper.EVENT_CHOOSE_NEXT_VIEW, d.v.id, idtype, range);
        });

      $buttons.exit().remove();
    });
  }

  setActiveNextView(viewId?: string) {
    const chooser = (<HTMLElement>this.$chooser.node());
    //disable old don't use d3 to don't screw up the data binding
    Array.from(chooser.querySelectorAll('button.active')).forEach((d: HTMLElement) => d.classList.remove('active'));
    if (viewId) {
      const button = chooser.querySelector(`button[data-viewid="${viewId}"]`);
      if (button) {
        button.classList.add('active');
      }
    }
  }

  get desc() {
    return toViewPluginDesc(this.plugin.desc);
  }

  get mode() {
    return this._mode;
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
}

export function createViewWrapper(graph: ProvenanceGraph, selection: ISelection, parent:Element, plugin:IPluginDesc, options?) {
  return plugin.load().then((p) => new ViewWrapper(graph, selection, parent, p, options));
}

export function replaceViewWrapper(existingView:ViewWrapper, selection: ISelection, plugin:IPluginDesc, options?) {
  return plugin.load().then((p) => existingView.replaceView(selection, p, options));
}