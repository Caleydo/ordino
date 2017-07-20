/**
 * Created by Samuel Gratzl on 07.06.2017.
 */
import {FormDialog} from 'phovea_ui/src/dialogs';
import {randomId} from 'phovea_core/src';
import FormBuilder from './FormBuilder';
import {IFormElementDesc} from './interfaces';
import {select} from 'd3';


export default class FormBuilderDialog extends FormDialog {
  readonly builder: FormBuilder;

  constructor(title: string, primaryButton: string, formId = 'form' + randomId(5)) {
    super(title, primaryButton, formId);
    this.body.innerHTML = ''; //clear old form since the form builder brings its own
    this.builder = new FormBuilder(select(this.body), formId);

    this.onHide(() => {
      this.destroy();
    });
  }

  append(...elements: IFormElementDesc[]) {
    this.builder.build(elements);
  }

  onSubmit(callback: (builder?: FormBuilder)=>void) {
    return super.onSubmit(() => {
      if (!this.builder.validate()) {
        return false;
      }
      callback(this.builder);
      return false;
    });
  }

  showAsPromise<T>(processData: (builder: FormBuilder) => T) {
    return new Promise<T>((resolve) => {
      this.onSubmit((builder) => {
        const data = processData(builder);
        if (data !== null) {
          this.hide();
          resolve(data);
        }
      });
      this.show();
    });
  }
}
