/**
 * Created by sam on 13.02.2017.
 */

import {createStackDesc} from 'lineupjs/src/model';
import * as d3 from 'd3';
import {IDType, resolve} from 'phovea_core/src/idtype';
import {IPlugin, IPluginDesc, list as listPlugins} from 'phovea_core/src/plugin';
import {editDialog} from '../storage';
import {EventHandler} from 'phovea_core/src/event';
import FormBuilderDialog from '../form/FormDialog';
import {FormElementType, IFormElementDesc} from '../form/interfaces';
import {OrdinoFormIds} from '../constants';

interface IColumnWrapper {
  text: string;
  action: (param: any) => void;
  plugins?: any[];
}

export class LineUpRankingButtons extends EventHandler {

  static readonly SAVE_NAMED_SET = 'saveNamedSet';
  static readonly ADD_SCORE_COLUMN = 'addScoreColumn';
  static readonly ADD_TRACKED_SCORE_COLUMN = 'addTrackedScoreColumn';

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
      .attr('class', 'fa fa-plus');

    // const $ul = $div.append('ul').attr('class', 'dropdown-menu');
    //
    const columns = this.lineup.data.getColumns()
      .filter((d) => !d._score)
      .map((d) => Object.assign(d, { name: d.label, id: d.column })); // use the same keys as in the scores
    // columns.push(createStackDesc('Weighted Sum'));
    // $ul.selectAll('li.col').data(columns)
    //   .enter()
    //   .append('li').classed('col', true)
    //   .append('a').attr('href', '#').text((d: any) => d.label)
    //   .on('click', (d) => {
    //     const ranking = this.lineup.data.getLastRanking();
    //     this.lineup.data.push(ranking, d);
    //     (<Event>d3.event).preventDefault();
    //   });
    //
    // $ul.append('li').classed('divider', true);
    //
    const scores = listPlugins('targidScore').filter((d: any) => d.idtype === this.idType.id);
    // $ul.selectAll('li.score').data(scores)
    //   .enter()
    //   .append('li').classed('score', true)
    //   .append('a').attr('href', '#').text((d) => d.name)
    //   .on('click', (d) => {
    //     d.load().then((p) => {
    //       this.scoreColumnDialog(p);
    //     });
    //     (<Event>d3.event).preventDefault();
    //   });
    //
    // LineUpRankingButtons.findScores(this.idType).then((ordinoScores: IPluginDesc[]) => {
    //
    //   $ul.selectAll('li.oscore').data(ordinoScores)
    //     .enter()
    //     .append('li').classed('oscore', true)
    //     .append('a').attr('href', '#').text((d) => d.name)
    //     .on('click', async (d) => {
    //       (<Event>d3.event).preventDefault();
    //       const p = await d.load();
    //       const params = await Promise.resolve(p.factory(d, this.extraArgs));
    //       this.fire(LineUpRankingButtons.ADD_TRACKED_SCORE_COLUMN, d.id, params);
    //     });
    // });


    $div.select('button').on('click', async () => {
      const dialog = new FormBuilderDialog('Add new column', 'Add');
      const scoreWrapper = listPlugins('scoreLoadingWrapper');
      const wrapperPromises = scoreWrapper.map((wrapper) => wrapper.load());

      const wrappers = await Promise.all(wrapperPromises);
      const ordinoScores: IPluginDesc[] = await LineUpRankingButtons.findScores(this.idType);

      const wrappedScores = [];
      wrappers.forEach((wrapper) => wrappedScores.push(...ordinoScores.map((score) => wrapper.factory(score))));

      const columnsWrapper: IColumnWrapper[] = [{
          text: 'Columns',
          plugins: columns,
          action: (column) => {
            const ranking = this.lineup.data.getLastRanking();
            this.lineup.data.push(ranking, column);
          }
        },
        {
          text: 'Parameterized Scores',
          plugins: wrappedScores,
          action: (scorePlugin) => {
            scorePlugin.factory().then((params) => this.fire(LineUpRankingButtons.ADD_TRACKED_SCORE_COLUMN, scorePlugin.id, params));
          }
        }, {
          text: 'Upload Score',
          plugins: scores,
          action: (plugin) => {
            plugin.load().then((p) => this.scoreColumnDialog(p));
          }
        }
      ];

      dialog.append({
        type: FormElementType.SELECT2,
        id: OrdinoFormIds.SCORE,
        label: 'Column',
        attributes: {
          style: 'width:100%'
        },
        required: true,
        options: {
          data: columnsWrapper.map((category) => {
            return {
              text: category.text,
              children: category.plugins.map((entry) => {
                return { text: entry.name, id: `${category.text}-${entry.id}` };
              })
            };
          })
        },
        useSession: true
      });
      dialog.show();

      dialog.onSubmit((builder) => {
        // TODO: validate
        const result = builder.getElementById(OrdinoFormIds.SCORE).value;
        const [category, scoreID] = result.id.split('-');

        const chosenCategory = columnsWrapper.find((cat) => cat.text === category);
        const plugin = chosenCategory.plugins.find((child) => child.id === scoreID);

        chosenCategory.action(plugin);

        dialog.hide();
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
