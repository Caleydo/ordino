/**
 * Created by Samuel Gratzl on 16.12.2015
 */
/// <amd-dependency path="./lineup" name="lineup"/>
declare const lineup:any;

import template = require('../clue/template');
import cmds = require('./cmds');
import cmode = require('../caleydo_provenance/mode');

import $ = require('jquery');

let helper = document.getElementById('app');

const elems = template.create(document.body, {
  app: 'Targid V2',
  application: '/targid2',
  id: 'targid2'
});

const main = <HTMLElement>elems.$main.node();
main.classList.add('targid');
while(helper.firstChild) {
  main.appendChild(helper.firstChild);
}

elems.graph.then((graph) => {
  const l = lineup.create(main.querySelector('div.lineup'));
});

elems.jumpToStored();
