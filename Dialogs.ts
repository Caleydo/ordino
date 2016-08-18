/**
 * Created by Holger Stitz on 18.08.2016.
 */

import d3 = require('d3');
import dialogs = require('../caleydo_bootstrap_fontawesome/dialogs');

/**
 * Use this modal dialog to show errors that were catched when an XHR request in a promise fails.
 * The dialog returns a promise that is resolved when the dialog is closed.
 * You can use that to clean up things in an error case.
 *
 * Usage:
 * ```
 * Promise(...)
 * .then(() => { ... }) //success
 * .catch(showErrorModalDialog) // open error dialog
 * .then((xhr) => { ... }); // do something after the error dialog has been closed
 * ```
 *
 * @param xhr
 * @returns {Promise<any>|Promise}
 */
export function showErrorModalDialog(xhr:any) {
  return new Promise((resolve) => {
    const dialog = dialogs.generateDialog(`Error ${xhr.status} (${xhr.statusText})`, 'Dismiss');

    d3.select(dialog.body).html(xhr.response);

    dialog.onSubmit(() => {
      dialog.hide();
      return false;
    });

    dialog.onHide(() => {
      resolve(xhr);
      dialog.destroy();
    });

    dialog.show();
  });
}
