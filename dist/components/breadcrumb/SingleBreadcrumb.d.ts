import { IWorkbench } from '../../store';
export interface IChevronProps {
    first?: boolean;
    flexWidth?: number;
    onClick?: () => void;
    color?: string;
    workbench?: IWorkbench;
    hideText?: boolean;
}
export declare function Chevron({ first, flexWidth, onClick, color, workbench, hideText }: IChevronProps): JSX.Element;
//# sourceMappingURL=SingleBreadcrumb.d.ts.map