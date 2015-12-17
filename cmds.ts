/**
 * Created by Samuel Gratzl on 16.12.2015.
 */

import C = require('../caleydo_core/main');
import prov = require('../caleydo_provenance/main');
import datatypes = require('../caleydo_core/datatype');
import d3 = require('d3');
import lineup = require('./lineup');
import detail = require('./detail');

export function changeRatioImpl(inputs, parameter) {
  const $main = inputs[0].value;
  const ratio = parameter.ratio;

  const $lineup = $main.select('div.lineup');
  const $detail = $main.select('div.detail');

  const old = parseFloat($lineup.attr('data-ratio')) / 100;

  $lineup.classed('hide', false).style('flex-grow', 100 * ratio).attr('data-ratio', ratio * 100);
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
    $detail.classed('hide', !hideLineUp).style('flex-grow', null);
    $lineup.classed('hide', hideLineUp).style('flex-grow', null);
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


export function selectDataImpl(inputs, parameter, graph) {
  const $main = inputs[0].value;
  return (inputs.length > 1 ? inputs[1].v : Promise.resolve(null)).then((data) => {
    const l = $main.select('div.lineup');
    l.selectAll('*').remove();

    const d = $main.select('div.detail');
    var prev = d.empty() ? null : d.datum();
    d.selectAll('*').remove();
    if (data) {
      lineup.create(data.slice(0), <Element>l.node());

      detail.create(data, <Element>l.node());
    }
    return {
      inverse: selectData(inputs[0], prev ? graph.findObject(prev) : null)
    }
  });
}

export function hide($main_ref:prov.IObjectRef<d3.Selection<any>>, what:string) {
  return prov.action(prov.meta('Hide ' + what, prov.cat.layout), 'hideTargetArea', hideImpl, [$main_ref], {
    elem: what
  });
}

export function show($main_ref:prov.IObjectRef<d3.Selection<any>>, what:string) {
  return prov.action(prov.meta('Show ' + what, prov.cat.layout), 'showTargetArea', showImpl, [$main_ref], {
    elem: what
  });
}

export function changeRatio($main_ref:prov.IObjectRef<d3.Selection<any>>, ratio:number) {
  return prov.action(prov.meta('Change ratio to ' + ratio, prov.cat.layout), 'changeRatioTargetArea', changeRatioImpl, [$main_ref], {
    ratio: ratio
  });
}

export function selectData($main_ref:prov.IObjectRef<d3.Selection<any>>, data_ref:prov.IObjectRef<datatypes.IDataType>) {
  var inputs : any[] = [$main_ref];
  if (data_ref) {
    inputs.push(data_ref);
  }
  return prov.action(prov.meta('Select ' + (data_ref ? data_ref.name : 'None'), prov.cat.data, prov.op.create), 'selectTargidData', selectDataImpl, inputs);
}

export function createCmd(id) {
  switch (id) {
    case 'showTargetArea':
      return showImpl;
    case 'hideTargetArea':
      return hideImpl;
    case 'changeRatioTargetArea':
      return changeRatioImpl;
    case 'selectTargidData':
      return selectDataImpl;

  }
  return null;
}
