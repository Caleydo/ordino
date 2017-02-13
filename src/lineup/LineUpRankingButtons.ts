/**
 * Created by sam on 13.02.2017.
 */

import {createStackDesc} from 'lineupjs/src/model';
import * as d3 from 'd3';
import {IDType} from 'phovea_core/src/idtype';
import {IPlugin, list as listPlugins} from 'phovea_core/src/plugin';
import {generateDialog} from 'phovea_ui/src/dialogs';
import {saveNamedSet} from '../storage';
import {EventHandler} from 'phovea_core/src/event';

export class LineUpRankingButtons extends EventHandler {

  public static SAVE_NAMED_SET = 'saveNamedSet';
  public static ADD_SCORE_COLUMN = 'addScoreColumn';

  constructor(private lineup, private $node: d3.Selection<any>, private idType: IDType, private extraArgs: any) {
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
    const dialog = generateDialog('Save Named Set');
    dialog.body.innerHTML = `
      <form id="namedset_form">
        <div class="form-group">
          <label for="namedset_name">Name</label>
          <input type="text" class="form-control" id="namedset_name" placeholder="Name" required="required">
        </div>
        <div class="form-group">
          <label for="namedset_description">Description</label>
          <textarea class="form-control" id="namedset_description" rows="5" placeholder="Description"></textarea>
        </div>
      </form>`;

    const form = <HTMLFormElement>dialog.body.querySelector('#namedset_form');

    form.onsubmit = () => {
      const name = (<HTMLInputElement>dialog.body.querySelector('#namedset_name')).value;
      const description = (<HTMLTextAreaElement>dialog.body.querySelector('#namedset_description')).value;

      this.fire(LineUpRankingButtons.SAVE_NAMED_SET, order, name, description);

      dialog.hide();
      return false;
    };

    dialog.footer.innerHTML = `<button type="submit" form="namedset_form" class="btn btn-default btn-primary">Save</button>`;

    dialog.onHide(() => {
      dialog.destroy();
    });

    dialog.show();
  }

  private appendMoreColumns() {
    const $div = this.$node.append('div');

    $div.append('button')
      .attr('class', 'fa fa-plus dropdown-toggle')
      .attr('data-toggle', 'dropdown');

    const $ul = $div.append('ul').attr('class', 'dropdown-menu');

    const columns = this.lineup.data.getColumns().filter((d) => !d._score);
    columns.push(createStackDesc());
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
