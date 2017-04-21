/**
 * Created by Holger Stitz on 07.09.2016.
 */

import {api2absURL} from 'phovea_core/src/ajax';
import {mixin} from 'phovea_core/src/index';
import {AView, IViewContext, ISelection, EViewMode} from './View';
import {IPluginDesc} from 'phovea_core/src/plugin';
import {FormBuilder, IFormSelectDesc, FormElementType, IFormSelectElement, IFormSelectOption} from './FormBuilder';
import * as session from 'phovea_core/src/session';

/**
 * helper view for proxying an existing external website
 */
export class ProxyView extends AView {

  protected static SELECTED_ITEM = 'externalItem';

  protected options = {
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

  protected paramForm:FormBuilder;

  constructor(context:IViewContext, protected selection: ISelection, parent:Element, options:any, plugin: IPluginDesc) {
    super(context, parent, options);
    mixin(this.options, plugin, options);
  }

  init() {
    super.init();

    this.$node.classed('proxy_view', true);

    // update the selection first, then update the proxy view
    this.updateSelectedItemSelect()
      .then(() => {
        this.updateProxyView();
      });
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

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    this.paramForm = new FormBuilder($parent);

    const paramDesc:IFormSelectDesc[] = [
      {
        type: FormElementType.SELECT,
        label: 'Show',
        id: ProxyView.SELECTED_ITEM,
        options: {
          optionsData: [],
        },
        useSession: true
      }
    ];

    // map FormElement change function to provenance graph onChange function
    paramDesc.forEach((p) => {
      p.options.onChange = (selection, formElement) => onChange(formElement.id, selection.value);
    });

    this.paramForm.build(paramDesc);

    // add other fields
    super.buildParameterUI($parent, onChange);
  }

  getParameter(name: string): any {
    if(this.paramForm.getElementById(name).value === null) {
      return '';
    }

    return this.paramForm.getElementById(name).value;
  }

  setParameter(name: string, value: any) {
    this.paramForm.getElementById(name).value = value;
    this.updateProxyView();
  }

  changeSelection(selection:ISelection) {
    this.selection = selection;

    // update the selection first, then update the proxy view
    this.updateSelectedItemSelect(true) // true = force use last selection
      .then(() => {
        this.updateProxyView();
      });
  }

  protected updateSelectedItemSelect(forceUseLastSelection = false) {
    return this.resolveIds(this.selection.idtype, this.selection.range)
      .then((names) => Promise.all<any>([names, this.getSelectionSelectData(names)]))
      .then((args: any[]) => {
        const names = <string[]>args[0]; // use names to get the last selected element
        const data = <{value:string, name:string, data:any}[]>args[1];
        const selectedItemSelect: IFormSelectElement = <IFormSelectElement>this.paramForm.getElementById(ProxyView.SELECTED_ITEM);

        // backup entry and restore the selectedIndex by value afterwards again,
        // because the position of the selected element might change
        const bak = selectedItemSelect.value || data[selectedItemSelect.getSelectedIndex()];
        selectedItemSelect.updateOptionElements(data);

        // select last item from incoming `selection.range`
        if(forceUseLastSelection) {
          selectedItemSelect.value = data.filter((d) => d.value === names[names.length-1])[0];

        // otherwise try to restore the backup
        } else if(bak !== null) {
          selectedItemSelect.value = bak;
        }
      });
  }

  protected getSelectionSelectData(names:string[]):Promise<IFormSelectOption[]> {
    if(names === null) {
      return Promise.resolve([]);
    }

    // hook
    return Promise.resolve(names.map((d) => ({value: d, name: d, data: d})));
  }

  protected updateProxyView() {
    this.loadProxyPage(this.getParameter(ProxyView.SELECTED_ITEM).value);
  }

  protected loadProxyPage(selectedItemId) {
    if (selectedItemId === null) {
      this.showErrorMessage(selectedItemId);
      return;
    }

    //remove old mapping error notice if any exists
    this.$node.selectAll('p').remove();
    this.$node.selectAll('iframe').remove();

    this.$node.append('iframe').attr('src', null);

    this.setBusy(true);

    const species = session.retrieve('species', 'human');
    const args = mixin(this.options.extra, {[this.options.argument]: selectedItemId, species});
    const url = this.createUrl(args);
    //console.log('start loading', this.$node.select('iframe').node().getBoundingClientRect());
    this.$node.select('iframe')
      .attr('src', url)
      .on('load', () => {
        this.setBusy(false);
        //console.log('finished loading', this.$node.select('iframe').node().getBoundingClientRect());
        this.fire(AView.EVENT_LOADING_FINISHED);
      });
  }

  protected showErrorMessage(selectedItemId: string) {
    this.setBusy(false);
    this.$node.html(`<p>Cannot map <i>${this.selection.idtype.name}</i> ('${selectedItemId}') to <i>${this.options.idtype}</i>.</p>`);
    this.fire(AView.EVENT_LOADING_FINISHED);
  }

  modeChanged(mode:EViewMode) {
    super.modeChanged(mode);
  }
}

export function create(context:IViewContext, selection:ISelection, parent:Element, options, plugin: IPluginDesc) {
  return new ProxyView(context, selection, parent, options, plugin);
}

