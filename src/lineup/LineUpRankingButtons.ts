/**
 * Created by sam on 13.02.2017.
 */

import {createStackDesc, IColumnDesc, createScriptDesc} from 'lineupjs/src/model';
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
import wrap from '../ScoreLoadingWrapper';
import LineUp from 'lineupjs/src/lineup';

interface IColumnWrapper<T> {
  text: string;
  action: (param: T) => void;
  plugins?: T[];
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

  private readonly $ul;

  constructor(private lineup: LineUp, private $node: d3.Selection<any>, private idType: IDType, private extraArgs: any) {
    super();

    this.$ul = this.$node.append('ul').classed('ordino-button-group', true);

    this.appendDownload();
    this.appendSaveRanking();
    this.appendMoreColumns();
    this.appendUpload();
  }

  private createMarkup(title: string = '', linkClass: string = '', linkListener: (param: any) => void | null, liClass: string = '') {
    const $li = this.$ul.append('li')
      .classed(liClass, liClass.length > 0);

    const $a = $li.append('a')
      .attr('title', title)
      .attr('href', '#')
      .classed(linkClass, linkClass .length> 0);

    if(linkListener) {
      $a.on('click', linkListener);
    }

    return $li;
  }

  private appendDownload() {
    const listener = (ranking) => {
      this.lineup.data.exportTable(ranking, {separator: ';', quote: true}).then((content) => {
        const downloadLink = document.createElement('a');
        const blob = new Blob([content], {type: 'text/csv;charset=utf-8'});
        downloadLink.href = URL.createObjectURL(blob);
        (<any>downloadLink).download = 'export.csv';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    };

    this.createMarkup('Export Data', 'fa fa-download', listener);
  }

  private appendSaveRanking() {
    const listener = (ranking) => {
      (<Event>d3.event).preventDefault();
      (<Event>d3.event).stopPropagation();

      this.saveRankingDialog(ranking.getOrder());
    };

    this.createMarkup('Save Named Set', 'fa fa-save', listener);
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
    const dropdown = this.createMarkup('Add Column', 'fa fa-plus dropdown-toggle', null, 'dropdown');

    dropdown.select('a')
      .attr('data-toggle', 'dropdown');

    const $selectWrapper = dropdown.append('div').attr('class', 'dropdown-menu');
    $selectWrapper.on('click', () => (<Event>d3.event).stopPropagation()); // HACK: don't close the dropdown when clicking Select2

    const builder = new FormBuilder($selectWrapper);

    // load plugins, which need to be checked if the IDTypes are mappable
    const ordinoScores: IPluginDesc[] = await LineUpRankingButtons.findMappablePlugins(this.idType, listPlugins('ordinoScore'));
    const metaDataPluginDescs = await LineUpRankingButtons.findMappablePlugins(this.idType, listPlugins('metaDataColumns'));

    const metaDataPluginPromises: Promise<IColumnWrapper<IScoreLoader>>[] = metaDataPluginDescs
      .map((plugin: IPluginDesc) => plugin.load()
        .then((loadedPlugin: IPlugin) => loadedPlugin.factory(plugin))
        .then((scores: IScoreLoader[]) => {
          return this.buildMetaDataDescriptions(plugin, scores);
        })
      );

    // Load meta data plugins
    const metaDataOptions = await Promise.all(metaDataPluginPromises);
    const loadedScorePlugins = ordinoScores.map((desc) => wrap(desc));


    const columns: IWrappedColumnDesc[] = this.lineup.data.getColumns()
      .filter((d) => !(<any>d)._score)
      .map((d) => ({ text: d.label, id: (<any>d).column, column: d }));

    columns.push({ text: 'Weighted Sum', id: 'weightedSum', column: createStackDesc('Weighted Sum') });
    columns.push({ text: 'Scripted Combination', id: 'scriptedCombination', column: createScriptDesc('Scripted Combination') });

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

    builder.build(elements);
  }

  private appendUpload() {
    const uploaderDesc = listPlugins('ordinoScoreButton')[0];

    if(uploaderDesc) {
      const listener = () => {
        uploaderDesc.load().then((p) => this.scoreColumnDialog(p));
        (<Event>d3.event).preventDefault();
        (<Event>d3.event).stopPropagation();
      };
      const upload = this.createMarkup(uploaderDesc.name,'fa fa-upload', listener);
    }
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
