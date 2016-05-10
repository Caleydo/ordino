/**
 * Created by Samuel Gratzl on 16.12.2015
 */

import template = require('../caleydo_clue/dummy');
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

  const view = views.findStartViewCreators();
  const $parent = d3.select('#tab_start');
  const $views = $parent.select('div').selectAll('div.panel').data(view);
  $views.enter().append('div').attr('class', 'panel panel-default').html((d,i) => `<div class="panel-heading" role="tab" id="view${i}">
                    <h4 class="panel-title">
                      <a role="button" ${i > 0 ? 'class="collapsed"' : ''} data-toggle="collapse" data-parent="#tab_start_acc" href="#viewBody${i}" aria-expanded="true" aria-controls="collapseOne">
                        ${d.name}
                      </a>
                    </h4>
                  </div>
                  <div id="viewBody${i}" class="panel-collapse collapse ${i === 0 ? 'in' : ''}" role="tabpanel" aria-labelledby="view${i}">
                    <div class="panel-body"></div>
                  </div>
                </div>`);

  $views.select('div.panel-body').each(function(d) {
    d.build(this);
  });
  $parent.select('button.btn-primary').on('click', () => {
    const s : views.IStartFactory = d3.select((<HTMLElement>$parent.select('div.collapse.in').node()).parentNode).datum();
    s.options().then((o) => {
      t.push(o.viewId, null, null, o.options);
      (<any>$('#welcomeDialog')).modal('hide');
    });
  });
  /*$views.enter().append('button').on('click', (d) => {
    t.push(d.id, null, null);
    (<any>$('#welcomeDialog')).modal('hide');
  });
  $views.text((d) => '+ ' + d.name);
  */
  if (graph.isEmpty) {
    (<any>$('#welcomeDialog')).modal('show');
  }
});

elems.jumpToStored();
