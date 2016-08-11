/**
 * Created by Holger Stitz on 11.08.2016.
 */

import {random_id} from '../caleydo_core/main';
import {EventHandler, IEventHandler} from '../caleydo_core/event';
import session = require('../caleydo_core/session');

export class FormBuilder {

  private $node;

  private formId = random_id();

  private elements:d3.Map<IFormElement> = d3.map<IFormElement>();

  constructor($parent) {
    this.$node = $parent.append('form');
  }

  build(elements:IFormElementDesc[]) {
    elements.map((el) => {
      this.appendElement(el);
    });
  }

  appendElement(element:IFormElementDesc) {
    // inject formId into form element id
    const uid = element.id + '_' + this.formId;

    element.attributes = element.attributes || {};
    element.attributes.id = uid; // add id as attribute
    element.attributes.clazz = element.attributes.clazz || '';
    element.attributes.clazz += ' form-control';

    switch (element.type) {
      case FormElement.SELECT:
        this.elements.set(element.id, new FormSelect(this, this.$node, element.id, element.label, element.attributes, element.options));
    }
  }

  getElementById(id:string) {
    return this.elements.get(id);
  }

}

export enum FormElement {
  SELECT
}

interface IFormElement extends IEventHandler {
  id: string;
  value: any;
}

export interface IFormElementDesc {
  type: FormElement;
  id: string;
  label: string;
  attributes?: {
    clazz?: string,
    id?: string
  };
  options?: {};
}

export interface IFormSelectDesc extends IFormElementDesc {
  options?: {
    onChange?: (selection:{name:string, value:string, data:any}, formElement:IFormElement) => any,
    options?: any[],
    dependsOn?: string,
    optionsFnc?: (selection:{name:string, value:string, data:any}) => any[],
    selectedIndex?: number,
    useSession?: boolean
  };
}


export class FormSelect extends EventHandler implements IFormElement {

  private $node;
  private $select;

  constructor(public formBuilder:FormBuilder, $parent, public id, private label, private attributes, private options) {
    super();

    this.$node = $parent.append('div').classed('form-group', true);

    this.build();
  }

  private build() {
    this.$node.append('label').attr('for', this.id).text(this.label);

    this.$select = this.$node.append('select');
    this.setAttributes(this.$select, this.attributes);
    this.handleOptions(this.$select, this.options);

    // propagate change action with the data of the selected option
    this.$select.on('change.propagate', () => {
      this.fire('change', d3.select(this.$select.node().selectedOptions[0]).datum(), this.$select);
    });
  }

  private setAttributes($node, attributes) {
    if(!attributes) {
      return;
    }

    for(let key in attributes) {
      // skip loop if the property is from prototype
      if(!attributes.hasOwnProperty(key)) {
        continue;
      }

      $node.attr((key === 'clazz') ? 'class' : key, attributes[key]);
    }
  }

  private handleOptions($select, options) {
    if(!options) {
      return;
    }

    if(options.onChange) {
      $select.on('change.customListener', () => {
        options.onChange(this.value, this);
      });
    }

    var optionData = options.options;

    if(options.dependsOn) {
      const dependElement = this.formBuilder.getElementById(options.dependsOn);

      if(!dependElement) {
        console.warn(`FormElement "${this.id}" depends on FormElement "${options.dependsOn}" that does not exists or might be defined later`);

      } else if(!options.optionsFnc) {
        console.warn(`FormElement "${this.id}" depends on FormElement "${options.dependsOn}", but the property "optionFnc" is not defined`);

      } else {
        optionData = options.optionsFnc(dependElement.value);

        dependElement.on('change', (evt, value) => {
          this.updateOptionElements(options.optionsFnc(value));
          $select.property('selectedIndex', options.selectedIndex || 0);

          // propagate that options has changed
          this.fire('change', this.value, $select);
        });
      }
    }

    var defaultSelectedIndex = 0;
    if(options.useSession) {
      defaultSelectedIndex = session.retrieve(this.id + '_selectedIndex', defaultSelectedIndex);
      $select.on('change.storeInSession', () => {
        session.store(this.id + '_selectedIndex', $select.node().selectedIndex);
      });
    }

    this.updateOptionElements(optionData);
    $select.property('selectedIndex', options.selectedIndex || defaultSelectedIndex);
  }

  updateOptionElements(data) {
    data = data.map((d) => {
      return {
        name: (d.name) ? d.name : d,
        value: (d.value) ? d.value : d,
        data: (d.data) ? d.data : d
      };
    });

    const $options = this.$select.selectAll('option').data(data);
    $options.enter().append('option');

    $options
      .attr('value', (d) => d.value)
      .text((d) => d.name);

    $options.exit().remove();
  }

  get value() {
    let option = d3.select(this.$select.node().selectedOptions[0]);
    return (option.size() > 0) ? option.datum() : null;
  }

  set value(v:string) {
    this.$select.selectAll('option').data().forEach((d, i) => {
      if(d.value === v) {
        this.$select.property('selectedIndex', i);
      }
    });
  }

}
