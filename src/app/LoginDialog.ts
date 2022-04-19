export function create(_loginMenu: HTMLElement, loginDialog: HTMLElement) {
  const LOCALSTORAGE_ACCEPT_GENIE_TERMS = 'ordino_accept_genie_terms';

  const checkboxAcceptGenieTerms: HTMLInputElement = loginDialog.querySelector('#accept_genie_terms');
  if (!checkboxAcceptGenieTerms) {
    console.warn('Accept GENIE terms checkbox in login dialog is missing!');
    return;
  }

  const localStorageValue = localStorage.getItem(LOCALSTORAGE_ACCEPT_GENIE_TERMS);

  if (localStorageValue !== null) {
    // check the checkbox if it was checked before
    checkboxAcceptGenieTerms.checked = localStorageValue === 'true';
  }

  checkboxAcceptGenieTerms.addEventListener('change', function () {
    localStorage.setItem(LOCALSTORAGE_ACCEPT_GENIE_TERMS, String(this.checked));
  });
}
