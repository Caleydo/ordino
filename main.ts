/**
 * Created by Samuel Gratzl on 16.12.2015
 */

import template = require('../caleydo_clue/template');
import header = require('../caleydo_bootstrap_fontawesome/header');
import targid = require('./Targid');
import views = require('./View');
import $ = require('jquery');

let helper = document.getElementById('app');
let helper2 = document.getElementById('extras');

const elems = template.create(document.body, {
  app: 'Targid V2',
  appLink: new header.AppHeaderLink('Targid V2', (event) => {
    (<any>$('#welcomeDialog')).modal('show');
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

  const view = views.findStartViewCreators();
  const $body = d3.select('#welcomeDialog div.modal-body');

  const $views = $body.select('ul.nav').selectAll('li.view').data(view);
  $views.enter().insert('li','.before').attr({
    role: 'presentation',
    'class': (d, i) => (i === 0 ? ' active' : '') + ' view'
  }).html((d,i) => `<a href="#tab_view${i}" aria-controls="tab_old" role="tab" data-toggle="tab">${d.name}</a>`);

  const $views2 = $body.select('div.tab-content').selectAll('div.tab-pane.view').data(view);
  const $views2_enter = $views2.enter().insert('div','.before').attr({
    role: 'tabpanel',
    'class': (d, i) => (i === 0 ? ' active' : '') + ' tab-pane view',
    id: (d,i) => `tab_view${i}`
  }).html(`<div></div><button class="btn btn-primary">Start</button>`);
  $views2_enter.select('div').each(function(d) {
    d.build(this);
  });
  $views2_enter.select('button:last-of-type').on('click', (d) => {
    d.options().then((o) => {
      t.push(o.viewId, null, null, o.options);
      (<any>$('#welcomeDialog')).modal('hide');
    });
  });

  if (graph.isEmpty) {
    (<any>$('#welcomeDialog')).modal('show');
  }
});

elems.jumpToStored();
