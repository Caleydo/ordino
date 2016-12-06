/**
 * Created by Holger Stitz on 07.09.2016.
 */

import {api2absURL} from '../caleydo_core/ajax';
import {random_id, mixin} from '../caleydo_core/main';
import {AView, IViewContext, ISelection, EViewMode} from './View';
import {IPluginDesc} from '../caleydo_core/plugin';

/**
 * helper view for proxying an existing external website
 */
export class ProxyView extends AView {

  private $params;
  private $selectType;
  private $formGroup;

  private options = {
    /**
     * proxy key - will be redirected through a local server proxy
     */
    proxy: null,
    /**
     * direct loading of an iframe site
     */
    site: null,
    /**
     * within the url {argument} will be replaced with the current selected id
     */
    argument: 'gene',
    /**
     * idtype of the argument
     */
    idtype: null,
    extra: {}
  };

  constructor(context:IViewContext, selection: ISelection, parent:Element, options:any, plugin: IPluginDesc) {
    super(context, parent, options);
    mixin(this.options, plugin, options);

    this.$node.classed('proxy_view', true);
    this.changeSelection(selection);
  }

  protected createUrl(args: any) {
    //use internal proxy
    if (this.options.proxy) {
      return api2absURL('/targid/proxy/' + this.options.proxy, args);
    }
    if (this.options.site) {
      return this.options.site.replace(/\{([^}]+)\}/gi, (match, variable) => args[variable]);
    }
    return null;
  }

  buildParameterUI($parent:d3.Selection<any>, onChange:(name:string, value:any)=>Promise<any>) {
    const id = random_id();

    this.$formGroup = $parent.append('div').classed('form-group', true);
    this.$selectType = this.$formGroup.select('select');
    this.$params = $parent;

    const elementName = 'element';

    this.$formGroup.append('label')
      .attr('for', elementName+'_' + id)
      .text('Show:');

    this.$selectType = this.$formGroup.append('select')
      .classed('form-control', true)
      .attr('id', elementName+'_' + id)
      .attr('required', 'required');
  }

  changeSelection(selection:ISelection) {
    const ids = selection.range.dim(0).asList();
    const idtype = selection.idtype;

    this.resolveIds(idtype, ids, this.options.idtype)
      .then((names) => this.filterSelectedNames(names))
      .then((names) => {
        let lastSelectedID = names[names.length-1];

        // prevent loading the page if item is null
        if (lastSelectedID === null) {
          return names;
        }

        this.build();
        this.loadProxyPage(selection, lastSelectedID);

        return names;
      })
      .then((names) => Promise.all([names, this.getSelectionDropDownLabels(names)]))
      .then((args) => {
        this.updateSelectionDropDown(selection, args[0], args[1]);
      });
  }

  protected getSelectionDropDownLabels(names:string[]):Promise<string[]> {
    // hook
    return Promise.resolve(names);
  }

  protected updateSelectionDropDown(selection:ISelection, names:string[], labels:string[]) {
    let selectedIndex = names.length-1;
    let lastSelectedID = names[selectedIndex];

    if (lastSelectedID === null) {
      this.setBusy(false);
      this.$selectType.selectAll('option').data();
      this.$node.html(`<p>Cannot map selected item to ${this.options.idtype}.</p>`);
      this.$formGroup.classed('hidden', true);
      this.fire(AView.EVENT_LOADING_FINISHED);
      return;
    }

    this.$formGroup.classed('hidden', false);
    this.$selectType.on('change', () => {
      lastSelectedID = names[(<HTMLSelectElement>this.$selectType.node()).selectedIndex];
      this.loadProxyPage(selection, lastSelectedID);
    });

    // create options
    const $options = this.$selectType.selectAll('option').data(names);
    $options.enter().append('option');
    $options.text((d,i) => labels[i]).attr('value', String);
    $options.exit().remove();

    // select first element by default
    this.$selectType.property('selectedIndex', selectedIndex);
  }

  /**
   * Override to filter names by specific rules
   * @param names
   * @returns {string[]}
   */
  protected filterSelectedNames(names:string[]):string[] {
    //FIXME HACK for UnitProt
    //filter 'AO*' UnitPort IDs that are not valid for external canSAR database
    return names.filter(d => d !== null && d.indexOf('A0') !== 0);
  }

  protected loadProxyPage(selection:ISelection, lastSelectedID) {
    this.setBusy(true);

    if (lastSelectedID != null) {
      let args = mixin(this.options.extra, {[this.options.argument]: lastSelectedID});
      const url = this.createUrl(args);
      //console.log('start loading', this.$node.select('iframe').node().getBoundingClientRect());
      this.$node.select('iframe')
        .attr('src', url)
        .on('load', () => {
          this.setBusy(false);
          //console.log('finished loading', this.$node.select('iframe').node().getBoundingClientRect());
          this.fire(AView.EVENT_LOADING_FINISHED);
        });
    } else {
      this.setBusy(false);
      this.$node.html(`<p>Cannot map <i>${selection.idtype.name}</i> ('${lastSelectedID}') to <i>${this.options.idtype}</i>.</p>`);
      this.fire(AView.EVENT_LOADING_FINISHED);
    }
  }

  private build() {

    //remove old mapping error notice if any exists
    this.$node.selectAll('p').remove();

    this.$node.append('iframe').attr('src', null);
  }

  modeChanged(mode:EViewMode) {
    super.modeChanged(mode);
  }
}

export function create(context:IViewContext, selection:ISelection, parent:Element, options, plugin: IPluginDesc) {
  return new ProxyView(context, selection, parent, options, plugin);
}

