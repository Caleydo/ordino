/**
 * Created by Samuel Gratzl on 16.12.2015
 */

// Dermine the order of css files manually

// HACK! because <amd-dependency path="bootstrap" /> is loaded after all the other stylesheets and not before (as declared)
/// <amd-dependency path="css!/bower_components/bootstrap/dist/css/bootstrap" />

/// <amd-dependency path="font-awesome" />
/// <amd-dependency path="css!../caleydo_bootstrap_fontawesome/style.css" />
/// <amd-dependency path="css!../caleydo_clue/style.css" />
/// <amd-dependency path="css!./style.css"/>

import template = require('../caleydo_clue/template');
import header = require('../caleydo_bootstrap_fontawesome/header');
import targid = require('./Targid');
import views = require('./View');
import $ = require('jquery');

let helper = document.getElementById('app');
let helper2 = document.getElementById('extras');

const elems = template.create(document.body, {
  app: 'TargID 2',
  appLink: new header.AppHeaderLink('TargID 2', (event) => {
    //(<any>$('#welcomeDialog')).modal('show');
    return false;
  }),
  application: '/targid2',
  id: 'targid2'
});

const main = <HTMLElement>elems.$main.node();
main.classList.add('targid');
while (helper.firstChild) {
  main.appendChild(helper.firstChild);
}
while (helper2.firstChild) {
  document.body.appendChild(helper2.firstChild);
}

elems.graph.then((graph) => {
  const t = targid.create(graph, main);
});

elems.jumpToStored();
