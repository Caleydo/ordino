import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
export declare enum EWorkbenchType {
    PREVIOUS = "t-previous",
    FOCUS = "t-focus",
    CONTEXT = "t-context",
    NEXT = "t-next"
}
export interface IWorkbenchViewsProps {
    index: number;
    type: EWorkbenchType;
}
export declare function WorkbenchViews({ index, type }: IWorkbenchViewsProps): JSX.Element;
//# sourceMappingURL=WorkbenchViews.d.ts.map