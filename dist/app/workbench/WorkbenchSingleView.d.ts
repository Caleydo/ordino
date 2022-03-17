import { IWorkbenchView } from '../../store';
export interface IWorkbenchSingleViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}
export declare function getVisynView(entityId: string): any;
export declare function WorkbenchSingleView({ workbenchIndex, view }: IWorkbenchSingleViewProps): JSX.Element;
//# sourceMappingURL=WorkbenchSingleView.d.ts.map