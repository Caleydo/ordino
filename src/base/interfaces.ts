export interface IRelationEntityReference {
  id: string;
  key: string;
  columns: string[];
}

// TODO: This enum was moved from reprovisyn
// It requires further refactoring together with lineup and tdp code. See links below for more details
// tdp_core https://github.com/datavisyn/tdp_core/blob/0548b2c45def8db6dc8a113daf34cd6d0be68503/src/base/rest.ts#L121
// lineup usages: https://github.com/datavisyn/tdp_core/blob/4bfd793c3b139a582031b16e987b07d1d1689ce2/src/lineup/desc.ts#L98
export enum EColumnType {
  categorical = 'categorical',
  number = 'number',
  string = 'string',
}

// TODO: This interface was moved from Reprovisyn and needs further refactoring together with the lineup/tdp_core column interfaces
export interface IColumnReference {
  columnName: string;
  show: boolean;
  label: string;
  type?: EColumnType;
}

export interface IOrdinoMapping {
  name: string;
  entity: string;
  sourceKey: string;
  targetKey: string;
  sourceToTargetColumns?: IColumnReference[];
  targetToSourceColumns?: IColumnReference[];
}

export interface IOrdinoRelation<Mapping extends IOrdinoMapping = IOrdinoMapping> {
  source: IRelationEntityReference;
  sourceToTargetLabel: string;
  target: IRelationEntityReference;
  targetToSourceLabel: string;
  mapping?: Mapping[];
}