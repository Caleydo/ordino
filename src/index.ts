/**
 * Created by Samuel Gratzl on 16.12.2015
 */

// Determine the order of css files manually

// HACK! because <amd-dependency path="bootstrap" /> is loaded after all the other stylesheets and not before (as declared)
/// <amd-dependency path="css!/bower_components/bootstrap/dist/css/bootstrap" />

/// <amd-dependency path="font-awesome" />
/// <amd-dependency path="css!phovea_bootstrap_fontawesome/style.css" /src/>
/// <amd-dependency path="css!./style.css"/>

import * as template from 'phovea_clue/src/template';
import * as header from 'phovea_bootstrap_fontawesome/src/header';
import * as targid from './Targid';

// cache the nodes from the targid2/index.html before the TargID app is created
// NOTE: the template (see next line) replaces the content of the document.body (but not document.head)
let appNode = document.getElementById('app');
let extrasNode = document.getElementById('extras');

// cache targid instance for logo app link
let targidInstance;

// create TargID app from CLUE template
const elems = template.create(document.body, {
  app: 'TargID 2',
  appLink: new header.AppHeaderLink('Target Discovery Platform', (event) => {
    event.preventDefault();
    targidInstance.openStartMenu();
    return false;
  }),
  application: 'TargID 2',
  id: 'targid2',
  recordSelectionTypes: null, // no automatic selection recording
  provVisCollapsed: true,
  thumbnails: false,
  headerOptions: {
    showReportBugLink: false
  }
});

// copy nodes from original document to new document (template)
const mainNode = <HTMLElement>elems.$main.node();
mainNode.classList.add('targid');
while (appNode.firstChild) {
  mainNode.appendChild(appNode.firstChild);
}
while (extrasNode.firstChild) {
  document.body.appendChild(extrasNode.firstChild);
}

// create TargID app once the provenance graph is available
elems.graph.then((graph) => {
  targidInstance = targid.create(graph, elems.clueManager, mainNode);
});

// jump to last stored state
elems.jumpToStored();
