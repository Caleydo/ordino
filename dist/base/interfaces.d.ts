export interface IRelationEntityReference {
    id: string;
    key: string;
    columns: string[];
}
export declare enum EColumnType {
    categorical = "categorical",
    number = "number",
    string = "string"
}
export interface IColumnReference {
    columnName: string;
    show: boolean;
    label: string;
    type?: EColumnType;
}
export interface IQueryFilter {
    col: string;
    op: string;
    val: (number | string)[];
}
export interface IOrdinoGlobalQuery {
    id: string;
    name: string;
    filter: IQueryFilter;
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
//# sourceMappingURL=interfaces.d.ts.map