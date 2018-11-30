import WelcomeViewTemplate from 'html-loader!./welcome_view.html';

export interface IWelcomeView {
  build();
}

export default class WelcomeView implements IWelcomeView {

  constructor(private parent: HTMLElement) {
    //
  }

  build() {
    this.parent.innerHTML = WelcomeViewTemplate;
  }
}
