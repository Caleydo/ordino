/**
 * Created by Holger Stitz on 02.08.2016.
 */

import ajax = require('../caleydo_core/ajax');
import C = require('../caleydo_core/main');
import {random_id} from '../caleydo_core/main';
import {AView, ISelection, IViewContext, EViewMode} from './View';
import {IPluginDesc} from '../caleydo_core/plugin';

export class ProxyView extends AView {
  /**
   * event is fired when the loading of the iframe has finished
   * @type {string}
   * @argument selection {ISelection}
   */
  static EVENT_LOADING_FINISHED = 'loadingFinished';

  private $params;
  private lastSelectedID;
  private $selectType;
  private $formGroup;

  private options = {
    proxy: null,
    site: null,
    argument: 'gene',
    idtype: null,
    extra: {}
  };

  constructor(context:IViewContext, selection: ISelection, parent:Element, plugin: IPluginDesc, options?) {
    super(context, parent, options);
    C.mixin(this.options, plugin, options);

    this.$node.classed('proxy_view', true);

    this.build();
    this.changeSelection(selection);
  }

  protected createUrl(args: any) {
    if (this.options.proxy) {
      return ajax.api2absURL('/targid/proxy/' + this.options.proxy, args);
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

      //filter 'AO*' UnitPort IDs that are not valid for external canSAR database
      allNames = allNames.filter(d => d.indexOf('A0') !== 0);

      this.lastSelectedID = allNames[0];
      this.loadProxyPage(selection);

      if (allNames.length === 1) {
        return;
      }

      this.$params.classed('hidden', false);
      this.$selectType.on('change', () => {

        this.lastSelectedID = allNames[(<HTMLSelectElement>this.$selectType.node()).selectedIndex];

        this.loadProxyPage(selection);
      });

      // create options
      const $options = this.$selectType.selectAll('option').data(allNames);
      $options.enter().append('option');
      $options.text((d)=>d).attr('value', (d)=>d);
      $options.exit().remove();

      // select first element by default
      this.$selectType.property('selectedIndex', 0);
    });
  }

  protected loadProxyPage(selection: ISelection) {
     this.setBusy(true);

      if (this.lastSelectedID != null) {
        var args = C.mixin(this.options.extra, {[this.options.argument]: this.lastSelectedID});
        const url = this.createUrl(args);
        //console.log('start loading', this.$node.select('iframe').node().getBoundingClientRect());
        this.$node.select('iframe')
          .attr('src', url)
          .on('load', () => {
            this.setBusy(false);
            //console.log('finished loading', this.$node.select('iframe').node().getBoundingClientRect());
            this.fire(ProxyView.EVENT_LOADING_FINISHED);
          });
      } else {
        this.setBusy(false);
        this.$node.html(`<p>Cannot map <i>${selection.idtype.name}</i> ('${this.lastSelectedID}') to <i>${this.options.idtype}</i>.</p>`);
        this.fire(ProxyView.EVENT_LOADING_FINISHED);
      }
  }

  private build() {

    this.$node.append('iframe').attr('src', null);
  }

  modeChanged(mode:EViewMode) {
    super.modeChanged(mode);
  }
}
