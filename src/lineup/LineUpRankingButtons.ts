/**
 * Created by sam on 13.02.2017.
 */

import {createStackDesc, IColumnDesc} from 'lineupjs/src/model';
import * as d3 from 'd3';
import {IDType, resolve} from 'phovea_core/src/idtype';
import {IPlugin, IPluginDesc, list as listPlugins} from 'phovea_core/src/plugin';
import {editDialog} from '../storage';
import {EventHandler} from 'phovea_core/src/event';
import {FormElementType, IFormElementDesc} from '../form/interfaces';
import {OrdinoFormIds} from '../constants';
import {IScoreLoader, IScoreLoaderExtensionDesc} from '../ScoreLoadingWrapper';
import FormBuilder from '../form/FormBuilder';
import {IButtonElementDesc} from '../form/internal/FormButton';

interface IColumnWrapper<T> {
  text: string;
  action: (param: T) => void;
  plugins?: Array<T>;
}

interface IWrappedColumnDesc {
  text: string;
  id: string;
  column: IColumnDesc;
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

  static findMappablePlugins(target: IDType, all: IPluginDesc[]) {
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

  private async appendMoreColumns() {
    const $div = this.$node.append('div');

    $div.append('button')
      .attr('class', 'fa fa-plus dropdown-toggle')
      .attr('data-toggle', 'dropdown');

    const $selectWrapper = $div.append('div').attr('class', 'dropdown-menu');
    $selectWrapper.on('click', () => (<Event>d3.event).stopPropagation()); // HACK: don't close the dropdown when clicking Select2

    const builder = new FormBuilder($selectWrapper);

    const uploads = listPlugins('targidScore').find((d: any) => d.idtype === this.idType.id);
    const scoreWrapper = listPlugins('scoreLoadingWrapper');

    // load plugins, which need to be checked if the IDTypes are mappable
    const ordinoScores: IPluginDesc[] = await LineUpRankingButtons.findMappablePlugins(this.idType, listPlugins('ordinoScore'));
    const metaDataPluginDescs = await LineUpRankingButtons.findMappablePlugins(this.idType, listPlugins('metaDataColumns'));

    $selectWrapper.insert('b', ':first-child').html(uploads? 'Select from dropdown or upload' : 'Select from dropdown');

    // load wrapper plugins
    const wrapperPromises = scoreWrapper.map((wrapper) => wrapper.load());
    const wrappers = await Promise.all(wrapperPromises);

    const loadedScorePlugins: IScoreLoader[] = [];

    const metaDataPluginPromises: Promise<IColumnWrapper<IScoreLoader>>[] = metaDataPluginDescs
      .map((plugin: IPluginDesc) => plugin.load()
        .then((loadedPlugin: IPlugin) => loadedPlugin.factory(plugin))
        .then((scores: IScoreLoader[]) => {
          return this.buildMetaDataDescriptions(plugin, scores);
        })
      );

    // Load meta data plugins
    const metaDataOptions = await Promise.all(metaDataPluginPromises);

    wrappers.forEach((wrapper) => {
      // wrap the score plugins
      loadedScorePlugins.push(...ordinoScores.map((desc) => wrapper.factory(desc)));
    });


    const columns: IWrappedColumnDesc[] = this.lineup.data.getColumns()
      .filter((d) => !d._score)
      .map((d) => ({ text: d.label, id: d.column, column: d }));

    const columnsWrapper: IColumnWrapper<IScoreLoader|IWrappedColumnDesc>[] = [
      {
        text: 'Columns',
        plugins: columns,
        action: (wrappedColumn: IWrappedColumnDesc) => {
          const ranking = this.lineup.data.getLastRanking();
          this.lineup.data.push(ranking, wrappedColumn.column);
        }
      },
      {
        text: 'Parameterized Scores',
        plugins: loadedScorePlugins,
        action: (scorePlugin: IScoreLoader) => {
          // number of rows of the last ranking
          const amountOfRows: number = this.lineup.data.getLastRanking().getOrder().length;

          // the factory function call executes the score's implementation
          scorePlugin.factory(this.extraArgs, amountOfRows).then((params) => this.fire(LineUpRankingButtons.ADD_TRACKED_SCORE_COLUMN, scorePlugin.id, params));
        }
      },
      ...metaDataOptions
    ];

    const elements: (IFormElementDesc|IButtonElementDesc)[] = [{
      type: FormElementType.SELECT2,
      id: OrdinoFormIds.ADDITIONAL_COLUMN,
      attributes: {
        style: 'width:200px'
      },
      hideLabel: true,
      options: {
        data: columnsWrapper.map((category) => {
          return {
            text: category.text,
            children: category.plugins.map((entry) => {
              return { text: entry.text, id: `${category.text}-${entry.id}` };
            })
          };
        }),
        onChange: () => {
          const dropdown = builder.getElementById(OrdinoFormIds.ADDITIONAL_COLUMN);
          const result = dropdown.value;
          dropdown.value = null;
          const [category, scoreID] = result.id.split('-');

          const chosenCategory = columnsWrapper.find((cat) => cat.text === category);
          const plugin = chosenCategory.plugins.find((child) => child.id === scoreID);

          chosenCategory.action(plugin);
        }
      }
    }];

    if(uploads) {
      elements.push({
        type: FormElementType.BUTTON,
        label: 'Upload',
        id: OrdinoFormIds.UPLOAD,
        onClick: () => {
          uploads.load().then((p) => this.scoreColumnDialog(p));
        }
      });
    }

    builder.build(elements);
  }

  private buildMetaDataDescriptions(desc: IPluginDesc, columns: IScoreLoader[]) {
    return {
      text: desc.name,
      plugins: columns,
      action: (plugin: IScoreLoader) => {
        // number of rows of the last ranking
        const amountOfRows: number = this.lineup.data.getLastRanking().getOrder().length;

        const params = plugin.factory(this.extraArgs, amountOfRows);
        this.fire(LineUpRankingButtons.ADD_TRACKED_SCORE_COLUMN, plugin.scoreId, params);
      }
    };
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
