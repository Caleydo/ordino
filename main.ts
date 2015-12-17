/**
 * Created by Samuel Gratzl on 16.12.2015
 */

import template = require('../clue/template');
import cmds = require('./cmds');
import cmode = require('../caleydo_provenance/mode');
import datas = require('../caleydo_core/data');
import matrix = require('../caleydo_core/matrix');
import lineup = require('./lineup');
import detail = require('./detail');
import d3 = require('d3');

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
  datas.list().then((data) => {
    var vectors = data.filter((d) => d.desc.type === 'matrix' && d.idtypes[1].name === 'GENE_SYMBOL');

    var $buttons = d3.select('div.browser').selectAll('button').data(vectors);
    $buttons.enter().append('button')
      .on('click', (d: matrix.IMatrix) => {
        d = d.t;
        lineup.create(d.slice(0), main.querySelector('div.lineup'));
        detail.create(d, main.querySelector('div.detail'));
      });
    $buttons.text((d) => d.desc.name);
    $buttons.exit().remove();
  });
});

elems.jumpToStored();
