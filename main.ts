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
while (helper.firstChild) {
  main.appendChild(helper.firstChild);
}

var lineup_instance,
  detail_instance;

elems.graph.then((graph) => {

  const $lineup = elems.$main.select('div.lineup');
  const $detail = elems.$main.select('div.detail');

  elems.$main.select('div.slider').call(d3.behavior.drag()
    .on('dragstart', () => (<any>d3.event).sourceEvent.stopPropagation())
    .on('drag', function () {
      const xy = d3.mouse(this.parentElement);
      const ratio = xy[0] / this.parentElement.getBoundingClientRect().width;
      $lineup.classed('hide', false).style('flex-grow', 100 * ratio);
      $detail.classed('hide', false).style('flex-grow', 100 * (1 - ratio));
    }).on('dragend', function () {
      const xy = d3.mouse(this.parentElement);
      const ratio = xy[0] / this.parentElement.getBoundingClientRect().width;
      graph.push(cmds.changeRatio(elems.$main_ref, ratio));
    }));

  elems.$main.select('div.slider i.fa-caret-left').on('click', function () {
    if (d3.event.defaultPrevented) {
      return;
    } // click suppressed
    graph.push(cmds.hide(elems.$main_ref, 'lineup'));
  });
  elems.$main.select('div.slider i.fa-caret-right').on('click', function () {
    if (d3.event.defaultPrevented) {
      return;
    } // click suppressed
    graph.push(cmds.hide(elems.$main_ref, 'detail'));
  });


  datas.list().then((data) => {
    var vectors = data.filter((d) => d.desc.type === 'matrix' && d.idtypes[1].name === 'GENE_SYMBOL');

    var $buttons = d3.select('div.browser').selectAll('button').data(vectors);
    $buttons.enter().append('button')
      .on('click', (d:matrix.IMatrix) => {
        d = d.t;
        if (lineup_instance) {
          lineup_instance.then((v) => v.destroy());
        }
        lineup_instance = lineup.create(d.slice(0), main.querySelector('div.lineup'));

        if (detail_instance) {
          detail_instance.destroy();
        }
        detail_instance = detail.create(d, main.querySelector('div.detail'));
      });
    $buttons.text((d) => d.desc.name);
    $buttons.exit().remove();
  });
});

elems.jumpToStored();
