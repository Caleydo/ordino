/**
 * Created by Holger Stitz on 18.08.2016.
 */

import * as d3 from 'd3';
import * as dialogs from 'phovea_ui/src/dialogs';

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
  return new Promise((resolve, reject) => {
    const dialog = dialogs.generateDialog(`Error ${xhr.status} (${xhr.statusText})`, 'Dismiss');
    const $body = d3.select(dialog.body);

    switch(xhr.status) {
      case 400:
        $body.html(`${xhr.responseText}`);
         break;
      default:
        $body.html(`${xhr.responseText}<hr>
        The requested URL was:<br><a href="${xhr.responseURL}" target="_blank">${xhr.responseURL}</a>`);
    }

    dialog.onSubmit(() => {
      dialog.hide();
      return false;
    });

    dialog.onHide(() => {
      reject(xhr);
      dialog.destroy();
    });

    dialog.show();
  });
}
