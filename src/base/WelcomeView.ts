import WelcomeViewTemplate from '../welcome_view.html';
import { IWelcomeView } from './IWelcomeView';

export class WelcomeView implements IWelcomeView {

  constructor(private parent: HTMLElement) {
    //
  }

  build() {
    this.parent.insertAdjacentHTML('afterbegin', WelcomeViewTemplate);
  }
}
