import { BaseArtifactType, NodeId, Nodes } from '@trrack/core';
import { IconConfig } from '../Utils/IconConfig';
interface ProvVisProps<T, S extends string, A extends BaseArtifactType<any>> {
    root: NodeId;
    currentNode: NodeId;
    nodeMap: Nodes<T, S, A>;
    config?: Partial<ProvVisConfig<T, S, A>>;
}
export interface ProvVisConfig<T, S extends string, A extends BaseArtifactType<any>> {
    gutter: number;
    verticalSpace: number;
    marginTop: number;
    marginLeft: number;
    animationDuration: number;
    annotationHeight: number;
    nodeAndLabelGap: number;
    labelWidth: number;
    iconConfig: IconConfig<T, S, A> | null;
    changeCurrent: (id: NodeId) => void;
    bookmarkNode: (id: NodeId) => void;
    annotateNode: (id: NodeId, annotation: string) => void;
    getAnnotation: (id: NodeId) => string;
    isBookmarked: (id: NodeId) => boolean;
}
export declare function ProvVis<T, S extends string, A extends BaseArtifactType<any>>({ nodeMap, root, currentNode, config }: ProvVisProps<T, S, A>): JSX.Element;
export {};
//# sourceMappingURL=ProvVis.d.ts.map