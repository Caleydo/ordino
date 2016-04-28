/**
 * Created by Samuel Gratzl on 16.12.2015
 */

import template = require('../caleydo_clue/template');
import cmode = require('../caleydo_clue/mode');
import targid = require('./Targid');
import views = require('./View');
import $ = require('jquery');

let helper = document.getElementById('app');
let helper2 = document.getElementById('extras');

const elems = template.create(document.body, {
  app: 'Targid V2',
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

  const view = views.findStartViews();
  const $views = d3.select('#tab_old').selectAll('button').data(view);
  $views.enter().append('button').on('click', (d) => {
    t.push(d.id, null, null);
    (<any>$('#welcomeDialog')).modal('hide');
  });
  $views.text((d) => '+ ' + d.name);

  if (graph.isEmpty) {
    (<any>$('#welcomeDialog')).modal('show');
  }
});

elems.jumpToStored();
