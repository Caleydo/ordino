import WelcomeViewTemplate from '../templates/welcome_view.html';
export class WelcomeView {
    constructor(parent) {
        this.parent = parent;
        //
    }
    build() {
        this.parent.insertAdjacentHTML('afterbegin', WelcomeViewTemplate);
    }
}
//# sourceMappingURL=WelcomeView.js.map