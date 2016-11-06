/**
 * Created by Holger Stitz on 07.09.2016.
 */

import {api2absURL} from 'phovea_core/src/ajax';
import {random_id, mixin} from 'phovea_core/src/index';
import {AView, IViewContext, ISelection, EViewMode} from './View';
import {IPluginDesc} from 'phovea_core/src/plugin';

/**
 * helper view for proxing an existing external website
 */
export class ProxyView extends AView {

  private $params;
  private lastSelectedID;
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
      .text(this.options.idtype + ' ID:');

     this.$selectType = this.$formGroup.append('select')
      .classed('form-control', true)
      .attr('id', elementName+'_' + id)
      .attr('required', 'required');
  }

  changeSelection(selection: ISelection) {
    const id = selection.range.last;
    const idtype = selection.idtype;

    this.resolveIdToNames(idtype, id, this.options.idtype).then((names) => {

      var allNames = names[0];
      console.log(allNames);
      if (!allNames) {
        this.setBusy(false);
        this.$selectType.selectAll('option').data();
        this.$node.html(`<p>Cannot map selected item to ${this.options.idtype}.</p>`);
        this.$formGroup.classed('hidden', true);
        this.fire(AView.EVENT_LOADING_FINISHED);
        return;
      }

      this.build();

      //FIXME HACK for UnitProt
      //filter 'AO*' UnitPort IDs that are not valid for external canSAR database
      allNames = allNames.filter(d => d.indexOf('A0') !== 0);

      this.lastSelectedID = allNames[0];
      this.loadProxyPage(selection);

      if (allNames.length === 1) {
        this.$formGroup.classed('hidden', true);
        return;
      }

      this.$formGroup.classed('hidden', false);
      this.$selectType.on('change', () => {
        this.lastSelectedID = allNames[(<HTMLSelectElement>this.$selectType.node()).selectedIndex];
        this.loadProxyPage(selection);
      });

      // create options
      const $options = this.$selectType.selectAll('option').data(allNames);
      $options.enter().append('option');
      $options.text(String).attr('value', String);
      $options.exit().remove();

      // select first element by default
      this.$selectType.property('selectedIndex', 0);
    });
  }

  protected loadProxyPage(selection: ISelection) {
     this.setBusy(true);

      if (this.lastSelectedID != null) {
        var args = mixin(this.options.extra, {[this.options.argument]: this.lastSelectedID});
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
        this.$node.html(`<p>Cannot map <i>${selection.idtype.name}</i> ('${this.lastSelectedID}') to <i>${this.options.idtype}</i>.</p>`);
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

export function create(context:IViewContext, selection: ISelection, parent:Element, options, plugin: IPluginDesc) {
  return new ProxyView(context, selection, parent, options, plugin);
}

