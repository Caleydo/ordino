import { IWorkbench } from '../../store';
export interface ISingleBreadcrumbProps {
    first?: boolean;
    flexWidth?: number;
    onClick?: () => void;
    color?: string;
    workbench?: IWorkbench;
}
export declare function SingleBreadcrumb({ first, flexWidth, onClick, color, workbench, }: ISingleBreadcrumbProps): JSX.Element;
