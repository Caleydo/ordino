export interface IRelationEntityReference {
  id: string;
  key: string;
  columns: string[];
}

export enum EOrdinoScoreType {
  GenericDBScore,
  CustomScoreImplementation, // TODO add more score types?
}

// TODO: Refactor
export enum EColumnType {
  categorical = 'categorical',
  number = 'number',
  string = 'string',
}

// TODO: Refactor this
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
