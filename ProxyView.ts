/**
 * Created by Holger Stitz on 07.09.2016.
 */

import {api2absURL} from '../caleydo_core/ajax';
import {mixin} from '../caleydo_core/main';
import {AView, IViewContext, ISelection, EViewMode} from './View';
import {IPluginDesc} from '../caleydo_core/plugin';
import {FormBuilder, IFormSelectDesc, FormElementType, IFormSelectElement} from './FormBuilder';

/**
 * helper view for proxying an existing external website
 */
export class ProxyView extends AView {

  protected static SELECTED_ITEM = 'selectedItem';

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

  protected paramForm:FormBuilder;

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
        useSession: false
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

    return this.paramForm.getElementById(name).value.data;
  }

  setParameter(name: string, value: any) {
    this.paramForm.getElementById(name).value = value;
    this.updateProxyView();
  }

  changeSelection(selection:ISelection) {
    // update the selection first, then update the proxy view
    this.updateSelectedItemSelect(selection)
      .then(() => {
        this.updateProxyView();
      });
  }

  private updateSelectedItemSelect(selection) {
    return this.resolveIds(selection.idtype, selection.range)
      .then((names) => Promise.all<any>([names, this.getSelectionDropDownLabels(names)]))
      .then((args) => {
        const names = args[0]; // use names to get the last selected element
        const data = args[1];
        const selectedItemSelect = this.paramForm.getElementById(ProxyView.SELECTED_ITEM);

        (<IFormSelectElement>selectedItemSelect).updateOptionElements(data);

        // select last item from incoming `selection.range`
        selectedItemSelect.value = data.filter((d) => d.value === names[names.length-1])[0];
      });
  }

  protected getSelectionDropDownLabels(names:string[]):Promise<{value:string, name:string, data:any}[]> {
    // hook
    return Promise.resolve(names.map((d:string) => {
      return {value: d, name: d, data: d};
    }));
  }

  protected updateProxyView() {
    const selection = null; // todo resolve
    this.loadProxyPage(selection, this.paramForm.getElementById(ProxyView.SELECTED_ITEM).value.value);
  }

  protected loadProxyPage(selection:ISelection, lastSelectedID) {
    //remove old mapping error notice if any exists
    this.$node.selectAll('p').remove();
    this.$node.selectAll('iframe').remove();

    this.$node.append('iframe').attr('src', null);

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

  modeChanged(mode:EViewMode) {
    super.modeChanged(mode);
  }
}

export function create(context:IViewContext, selection:ISelection, parent:Element, options, plugin: IPluginDesc) {
  return new ProxyView(context, selection, parent, options, plugin);
}

