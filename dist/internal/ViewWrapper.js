/** ******************************************************************
 * Copyright (c) The Caleydo Team, http://caleydo.org
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 ******************************************************************* */
import { EventHandler } from 'visyn_core/base';
import { ObjectRefUtils, TDPApplicationUtils, AView, EViewMode, ViewUtils, } from 'tdp_core';
import * as d3v3 from 'd3v3';
import { MODE_ANIMATION_TIME } from './constants';
function generateHash(desc, selection) {
    const s = `${selection.idtype ? selection.idtype.id : ''}r${selection.ids}`;
    return `${desc.id}_${s}`;
}
// function to get the previous siblings of an element, used to calculate a unique id for the viewwrapper
const previousSiblings = (elem) => {
    // create an empty array
    const siblings = [];
    // eslint-disable-next-line no-cond-assign
    while ((elem = elem.previousElementSibling)) {
        siblings.push(elem);
    }
    return siblings;
};
/**
 * Scrolls an element to the given horizontal target position (i.e., x-axis).
 * This function is a modified version from https://medium.com/@snowleo208/how-to-create-smooth-scroll-for-your-website-ce5b198d9d94
 *
 * @param element HTML element that will be scrolled
 * @param target Horizontal target position
 * @param duration Duration of the animation (default: 600 ms)
 */
function scrollTo(element, target, duration = 600) {
    let start = null;
    const firstPosX = element.scrollLeft || 0;
    let posX = 0;
    (function () {
        const browser = ['ms', 'moz', 'webkit', 'o'];
        for (let x = 0, { length } = browser; x < length && !window.requestAnimationFrame; x++) {
            window.requestAnimationFrame = window[`${browser[x]}RequestAnimationFrame`];
            window.cancelAnimationFrame = window[`${browser[x]}CancelAnimationFrame`] || window[`${browser[x]}CancelRequestAnimationFrame`];
        }
    })();
    function showAnimation(timestamp) {
        if (!start) {
            start = timestamp || new Date().getTime();
        } // get id of animation
        const elapsed = timestamp - start;
        const progress = elapsed / duration; // animation duration
        // ease in function from https://github.com/component/ease/blob/master/index.js
        const outQuad = function (n) {
            return n * (2 - n);
        };
        const easeInPercentage = +outQuad(progress).toFixed(2);
        // if target is 0 (back to left), the position is: current pos + (current pos * percentage of duration)
        // if target > 0 (not back to left), the positon is current pos + (target pos * percentage of duration)
        posX = target === 0 ? firstPosX - firstPosX * easeInPercentage : firstPosX + target * easeInPercentage;
        element.scrollTo(posX, 0);
        // console.log(posX, target, firstPosX, progress);
        if ((target !== 0 && posX >= firstPosX + target) || (target === 0 && posX <= 0)) {
            cancelAnimationFrame(start);
            posX = 0;
        }
        else {
            window.requestAnimationFrame(showAnimation);
        }
    }
    window.requestAnimationFrame(showAnimation);
}
export class ViewWrapper extends EventHandler {
    /**
     * Initialize this view, create the root node and the (inner) view
     * @param graph
     * @param selection
     * @param itemSelection
     * @param parent
     * @param plugin
     * @param options
     */
    constructor(graph, selection, itemSelection, parent, plugin, firstTime, options) {
        super();
        this.graph = graph;
        this.selection = selection;
        this.plugin = plugin;
        this.firstTime = firstTime;
        this.options = options;
        this._mode = null;
        this.instance = null;
        /**
         * Listens to the AView.EVENT_ITEM_SELECT event and decided if the chooser should be visible.
         * Then dispatches the incoming event again (aka bubbles up).
         * @param event
         * @param oldSelection
         * @param newSelection
         */
        this.listenerItemSelect = (event, oldSelection, newSelection) => {
            this.chooseNextViews(newSelection.idtype, newSelection.ids);
            this.fire(AView.EVENT_ITEM_SELECT, oldSelection, newSelection);
        };
        /**
         * Forward event from view to app instance
         * @param event
         * @param idtype
         * @param namedSet
         */
        this.listenerUpdateEntryPoint = (event, namedSet) => {
            this.fire(AView.EVENT_UPDATE_ENTRY_POINT, namedSet);
        };
        /**
         * Wrapper function for event listener
         */
        this.scrollIntoViewListener = () => {
            this.scrollIntoView();
        };
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
    init(graph, selection, plugin, options) {
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
    createView(selection, itemSelection, plugin, options) {
        // add data-testid to viewWrapper, use id of viewWrapper and number of previous siblings to make it unique
        const numPrevSiblings = previousSiblings(this.$viewWrapper.node()).length;
        this.$viewWrapper.attr('data-testid', `viewWrapper-${numPrevSiblings}`);
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
            .attr('data-testid', 'close-button')
            .on('click', (d) => {
            this.remove();
        });
        const $params = this.$node.append('div').attr('class', 'parameters container-fluid ps-0 pe-0').datum(this);
        const $inner = this.$node.append('div').classed('inner', true);
        this.instance = plugin.factory(this.context, selection, $inner.node(), options, plugin.desc);
        return Promise.resolve(this.instance.init($params.node(), this.onParameterChange.bind(this)))
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
    replaceView(selection, itemSelection, plugin, firstTime, options) {
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
    destroyView() {
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
    onParameterChange(name, value, previousValue, isInitializion) {
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
    getParameter(name) {
        return this.instance.getParameter(name);
    }
    setParameterImpl(name, value) {
        return this.instance.setParameter(name, value);
    }
    getItemSelection() {
        return this.instance.getItemSelection();
    }
    setItemSelection(sel) {
        // turn listener off, to prevent an infinite event loop
        this.instance.off(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);
        return Promise.resolve(this.instance.setItemSelection(sel)).then(() => {
            this.chooseNextViews(sel.idtype, sel.ids);
            // turn listener on again
            this.instance.on(AView.EVENT_ITEM_SELECT, this.listenerItemSelect);
        });
    }
    setParameterSelection(selection) {
        if (ViewUtils.isSameSelection(this.selection, selection)) {
            return undefined;
        }
        this.selection = selection;
        return Promise.resolve(this.instance.setInputSelection(selection));
    }
    getParameterSelection() {
        return this.selection;
    }
    matchSelectionLength(length) {
        return ViewUtils.matchLength(this.desc.selection, length) || (ViewUtils.showAsSmallMultiple(this.desc) && length > 1);
    }
    modeChanged(mode) {
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
    updateAfterAnimation() {
        if (!this.instance || typeof this.instance.update !== 'function') {
            return;
        }
        setTimeout(() => {
            if (this.instance && typeof this.instance.update === 'function') {
                this.instance.update();
            }
        }, MODE_ANIMATION_TIME);
    }
    scrollIntoView() {
        const scrollToPos = this.$viewWrapper.node()?.previousSibling?.offsetLeft ?? 0;
        scrollTo(this.$viewWrapper.node().parentElement, scrollToPos, MODE_ANIMATION_TIME);
    }
    /**
     * Decide if a chooser for the next view should be shown and if so, which next views are available
     * @param idtype
     * @param selection
     */
    chooseNextViews(idtype, selection) {
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
            $buttons.attr('data-testid', (d) => d.id);
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
    setActiveNextView(viewId) {
        const chooser = this.$chooser.node();
        // disable old don't use d3 to don't screw up the data binding
        Array.from(chooser.querySelectorAll('button.active')).forEach((d) => d.classList.remove('active'));
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
    set mode(mode) {
        if (this._mode === mode) {
            return;
        }
        const b = this._mode;
        this.modeChanged(mode);
        this.fire(ViewWrapper.EVENT_MODE_CHANGED, (this._mode = mode), b);
    }
    get node() {
        return this.$node.node();
    }
    remove() {
        this.fire(ViewWrapper.EVENT_REMOVE, this);
    }
    focus() {
        this.fire(ViewWrapper.EVENT_FOCUS, this);
    }
    static createViewWrapper(graph, selection, itemSelection, parent, plugin, firstTime, options) {
        return plugin.load().then((p) => new ViewWrapper(graph, selection, itemSelection, parent, p, firstTime, options));
    }
    static replaceViewWrapper(existingView, selection, itemSelection, plugin, firstTime, options) {
        return plugin.load().then((p) => existingView.replaceView(selection, itemSelection, p, firstTime, options));
    }
}
ViewWrapper.EVENT_CHOOSE_NEXT_VIEW = 'open';
ViewWrapper.EVENT_FOCUS = 'focus';
ViewWrapper.EVENT_REMOVE = 'remove';
ViewWrapper.EVENT_MODE_CHANGED = 'modeChanged';
ViewWrapper.EVENT_REPLACE_VIEW = 'replaceView';
//# sourceMappingURL=ViewWrapper.js.map