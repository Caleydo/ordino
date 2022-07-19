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