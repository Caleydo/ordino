import { IColumnDesc } from 'lineupjs';
import { DefineVisynViewPlugin, IDTypeManager, IScoreRow, IServerColumn, isVisynViewPluginDesc, ViewUtils } from 'tdp_core';

/**
 * relation list types?
 */
export enum EReprovisynRelationList {
  filter,
  all,
}

/**
 * redacted reprovisyn entity type
 */
export interface ITransitionEntity {
  id: string;
  key: string;
  columns: string[];
}

export enum EReprovisynScoreType {
  GenericDBScore,
  CustomScoreImplementation, // TODO add more score types?
}

export enum EReprovisynColumnType {
  categorical = 'categorical',
  number = 'number',
  string = 'string',
}

export interface IReprovisynColumnReference {
  columnName: string;
  show: boolean;
  label: string;
  type?: EReprovisynColumnType;
}

export interface ITransitionMapping {
  name: string;
  entity: string;
  sourceKey: string;
  targetKey: string;
  sourceToTargetColumns?: IReprovisynColumnReference[];
  targetToSourceColumns?: IReprovisynColumnReference[];
}

/**
 * reprovisyn relation type
 */
export enum ETransitionType {
  OneToN = '1-n',
  MToN = 'm-n',
  OrdinoDrilldown = 'ordino-drilldown',
}
export interface IReprovisynRelation {
  type: ETransitionType;
  source: ITransitionEntity;
  sourceToTargetLabel: string;
  target: ITransitionEntity;
  targetToSourceLabel: string;
  mapping?: ITransitionMapping[];
}

export interface IWorkbenchTransition {
  type: ETransitionType;
  source: ITransitionEntity;
  sourceToTargetLabel: string;
  target: ITransitionEntity;
  targetToSourceLabel: string;
  mapping?: ITransitionMapping[];
}
export interface IOrdinoVisynViewDesc {
  transition: IWorkbenchTransition;
}

export interface IOrdinoVisynViewParam {
  prevSelection: string[];
  selectedMappings: ITransitionMapping[];
}

export type OrdinoVisynViewPluginType<
  Param extends Record<string, unknown> = Record<string, unknown>,
  Desc extends Record<string, unknown> = Record<string, unknown>,
> = DefineVisynViewPlugin<
  'ranking',
  Param & IOrdinoVisynViewParam,
  {
    /**
     * Data array matching the columns defined in the `dataDesc`.
     */
    data: Record<string, unknown>[];
    /**
     * Data column description describing the given `data`.
     * TODO:: Type to IReprovisynServerColumn when we merge that into tdp_core
     */
    dataDesc: IServerColumn[] | any[];

    /**
     * List of items which are filtered out of the view. Ids match the idtype from 'desc.idtype'
     */
    filteredOutIds: string[];

    /**
     * Callback when the Filter changed.
     * @param filteredOutIds New Filter.
     */
    onFilteredOutIdsChanged(filteredOutIds: React.SetStateAction<string[]>): void;

    /**
     * Callback when the Column Description changed.
     * @param desc New Column Description.
     */
    onColumnDescChanged(desc: IColumnDesc): void;
    /**
     * Callback when the Data changed.
     * @param data New Data.
     */
    onDataChanged(data: any[]): void;
    /**
     * Callback when a score column is added.
     * @param desc desc of new column.
     * @param data data of new column.
     */
    onAddScoreColumn(
      desc: IColumnDesc & {
        [key: string]: any;
      },
      data: IScoreRow<any>[],
    ): void;
  },
  Desc & IOrdinoVisynViewDesc
>;

export type OrdinoVisynViewPluginTyp = OrdinoVisynViewPluginType;

export function isVisynRankingViewDesc(desc: unknown): desc is OrdinoVisynViewPluginType['desc'] {
  return isVisynViewPluginDesc(desc) && (<any>desc)?.visynViewType === 'ranking';
}

export function isVisynRankingView(plugin: unknown): plugin is OrdinoVisynViewPluginType['plugin'] {
  return isVisynViewPluginDesc((<any>plugin)?.desc) && (<any>plugin)?.viewType === 'ranking';
}

/**
 * Find all available workbenches to transition to for my workbench
 * @param idType
 * @returns available transitions
 */
export const findWorkbenchTransitions = async (idType: string) => {
  const views = await ViewUtils.findVisynViews(IDTypeManager.getInstance().resolveIdType(idType));
  return views.filter((v) => isVisynRankingViewDesc(v)) as OrdinoVisynViewPluginType['desc'][];
};
