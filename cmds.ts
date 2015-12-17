/**
 * Created by Samuel Gratzl on 16.12.2015.
 */

import C = require('../caleydo_core/main');
import prov = require('../caleydo_provenance/main');
import d3 = require('d3');

export function changeRatioImpl(inputs, parameter) {
  const $main = inputs[0].value;
  const ratio = parameter.ratio;

  const $lineup = $main.select('div.lineup');
  const $detail = $main.select('div.detail');

  const old = parseFloat($lineup.attr('data-ratio')) / 100;

  $lineup.classed('hide', false).style('flex-grow', 100 * ratio).attr('data-ratio', ratio*100);
  $detail.classed('hide', false).style('flex-grow', 100 * (1 - ratio));

  return {
    inverse: changeRatio(inputs[0], old)
  }
}

export function hideImpl(inputs, parameter) {
  const $main = inputs[0].value;
  const hideLineUp = parameter.elem === 'lineup';
  const $lineup = $main.select('div.lineup');
  const $detail = $main.select('div.detail');

  if ($lineup.classed('hide')) {
    $lineup.classed('hide', false);
  } else {
    $detail.classed('hide', !hideLineUp).style('flex-grow',null);
    $lineup.classed('hide', hideLineUp).style('flex-grow',null);
  }

  return {
    inverse: show(inputs[0], parameter.elem)
  }
}
export function showImpl(inputs, parameter) {
  const $main = inputs[0].value;
  const hideLineUp = parameter.elem === 'lineup';
  const $elem = $main.select('div.' + parameter.elem);
  $elem.classed('hide', false);

  return {
    inverse: hide(inputs[0], parameter.elem)
  }
}

export function hide($main_ref : prov.IObjectRef<d3.Selection<any>>, what: string) {
  return prov.action(prov.meta('Hide '+what,prov.cat.layout), 'hideTargetArea', hideImpl, [ $main_ref], {
    elem: what
  });
}

export function show($main_ref : prov.IObjectRef<d3.Selection<any>>, what: string) {
  return prov.action(prov.meta('Show '+what,prov.cat.layout), 'showTargetArea', showImpl, [ $main_ref], {
    elem: what
  });
}

export function changeRatio($main_ref : prov.IObjectRef<d3.Selection<any>>, ratio: number) {
  return prov.action(prov.meta('Change ratio to '+ratio,prov.cat.layout), 'changeRatioTargetArea', changeRatioImpl, [ $main_ref], {
    ratio: ratio
  });
}

export function createCmd(id) {
  switch (id) {
    case 'showTargetArea':
      return showImpl;
    case 'hideTargetArea':
      return hideImpl;
    case 'changeRatioTargetArea':
      return changeRatioImpl;
  }
  return null;
}
