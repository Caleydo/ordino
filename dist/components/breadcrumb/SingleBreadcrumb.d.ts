import { IWorkbench } from '../../store';
export interface ISingleBreadcrumbProps {
    first?: boolean;
    flexWidth?: number;
    onClick?: () => void;
    color?: string;
    workbench?: IWorkbench;
    hideText?: boolean;
}
export declare function SingleBreadcrumb({ first, flexWidth, onClick, color, workbench, hideText, }: ISingleBreadcrumbProps): JSX.Element;
//# sourceMappingURL=SingleBreadcrumb.d.ts.map