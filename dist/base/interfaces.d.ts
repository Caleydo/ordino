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
/**
 * TODO: This interface was moved from Reprovisyn and needs further refactoring together with the lineup/tdp_core column interfaces
 */
export interface IColumnReference {
    columnName: string;
    show: boolean;
    label: string;
    type?: EColumnType;
}
/**
 * used to filter columns based on the specified filter operators and values
 */
export interface IQueryFilter {
    col: string;
    op: string;
    val: (number | string)[];
}
/**
 * used to store a global query name and a corresponding filter that is applied for all entity data in our ordino workbenches
 */
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
    columns?: IColumnReference[];
}
export interface IOrdinoRelation<Mapping extends IOrdinoMapping = IOrdinoMapping> {
    source: IRelationEntityReference;
    label: string;
    target: IRelationEntityReference;
    mapping?: Mapping[];
}
//# sourceMappingURL=interfaces.d.ts.map