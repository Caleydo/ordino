/**
 * Created by sam on 13.02.2017.
 */

import {createStackDesc} from 'lineupjs/src/model';
import * as d3 from 'd3';
import {IDType, resolve} from 'phovea_core/src/idtype';
import {IPlugin, IPluginDesc, list as listPlugins} from 'phovea_core/src/plugin';
import {editDialog} from '../storage';
import {EventHandler} from 'phovea_core/src/event';
import LineUp from 'lineupjs/src/lineup';

export class LineUpRankingButtons extends EventHandler {

  static readonly SAVE_NAMED_SET = 'saveNamedSet';
  static readonly ADD_SCORE_COLUMN = 'addScoreColumn';
  static readonly ADD_TRACKED_SCORE_COLUMN = 'addTrackedScoreColumn';

  constructor(private lineup: LineUp, private $node: d3.Selection<any>, private idType: IDType, private extraArgs: any) {
    super();

    this.appendDownload();
    this.appendSaveRanking();
    this.appendMoreColumns();
  }

  private appendDownload() {
    this.$node.append('button')
      .attr('class', 'fa fa-download')
      .on('click', (ranking) => {
        this.lineup.data.exportTable(ranking, {separator: ';', quote: true}).then((content) => {
          const downloadLink = document.createElement('a');
          const blob = new Blob([content], {type: 'text/csv;charset=utf-8'});
          downloadLink.href = URL.createObjectURL(blob);
          (<any>downloadLink).download = 'export.csv';

          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        });
      });
  }

  private appendSaveRanking() {
    this.$node.append('button')
      .attr('class', 'fa fa-save')
      .on('click', (ranking) => {
        this.saveRankingDialog(ranking.getOrder());
      });
  }

  private saveRankingDialog(order: number[]) {
    editDialog(null, (name, description, isPublic) => {
      this.fire(LineUpRankingButtons.SAVE_NAMED_SET, order, name, description, isPublic);
    });
  }

  static findScores(target: IDType) {
    const all = listPlugins('ordinoScore');
    const idTypes = Array.from(new Set<string>(all.map((d) => d.idtype)));

    function canBeMappedTo(idtype: string) {
      if (idtype === target.id) {
        return true;
      }
      //lookup the targets and check if our target is part of it
      return resolve(idtype).getCanBeMappedTo().then((mappables: IDType[]) => mappables.some((d) => d.id === target.id));
    }
    //check which idTypes can be mapped to the target one
    return Promise.all(idTypes.map(canBeMappedTo)).then((mappable: boolean[]) => {
      const valid = idTypes.filter((d, i) => mappable[i]);
      return all.filter((d) => valid.indexOf(d.idtype) >= 0);
    });
  }

  private appendMoreColumns() {
    const $div = this.$node.append('div');

    $div.append('button')
      .attr('class', 'fa fa-plus dropdown-toggle')
      .attr('data-toggle', 'dropdown');

    const $ul = $div.append('ul').attr('class', 'dropdown-menu');

    const columns = this.lineup.data.getColumns().filter((d) => !(<any>d)._score);
    columns.push(createStackDesc('Weighted Sum'));
    $ul.selectAll('li.col').data(columns)
      .enter()
      .append('li').classed('col', true)
      .append('a').attr('href', '#').text((d: any) => d.label)
      .on('click', (d) => {
        const ranking = this.lineup.data.getLastRanking();
        this.lineup.data.push(ranking, d);
        (<Event>d3.event).preventDefault();
      });

    $ul.append('li').classed('divider', true);

    const scores = listPlugins('targidScore').filter((d: any) => d.idtype === this.idType.id);
    $ul.selectAll('li.score').data(scores)
      .enter()
      .append('li').classed('score', true)
      .append('a').attr('href', '#').text((d) => d.name)
      .on('click', (d) => {
        d.load().then((p) => {
          this.scoreColumnDialog(p);
        });
        (<Event>d3.event).preventDefault();
      });

    LineUpRankingButtons.findScores(this.idType).then((ordinoScores: IPluginDesc[]) => {
      $ul.selectAll('li.oscore').data(ordinoScores)
        .enter()
        .append('li').classed('oscore', true)
        .append('a').attr('href', '#').text((d) => d.name)
        .on('click', async (d) => {
          (<Event>d3.event).preventDefault();
          const p = await d.load();
          const params = await Promise.resolve(p.factory(d, this.extraArgs));
          this.fire(LineUpRankingButtons.ADD_TRACKED_SCORE_COLUMN, d.id, params);
        });
    });
  }

  private scoreColumnDialog(scorePlugin: IPlugin) {
    //TODO clueify
    // pass dataSource into InvertedAggregatedScore factory method
    Promise.resolve(scorePlugin.factory(scorePlugin.desc, this.extraArgs)) // open modal dialog
      .then((scoreImpl) => { // modal dialog is closed and score created
        this.fire(LineUpRankingButtons.ADD_SCORE_COLUMN, scoreImpl, scorePlugin);
      });
  }
}
