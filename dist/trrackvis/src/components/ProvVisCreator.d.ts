import { NodeID, Provenance, ProvenanceGraph } from '@visdesignlab/trrack';
import { BundleMap } from '../Utils/BundleMap';
import { EventConfig } from '../Utils/EventConfig';
export interface ProvVisConfig {
    eventConfig: EventConfig<any>;
    editAnnotations: boolean;
    bundleMap: BundleMap;
    iconOnly: boolean;
    iconSize: number;
    height: number;
    width: number;
    sideOffset: number;
    backboneGutter: number;
    gutter: number;
    verticalSpace: number;
    regularCircleRadius: number;
    backboneCircleRadius: number;
    regularCircleStroke: number;
    backboneCircleStroke: number;
    topOffset: number;
    textSize: number;
    linkWidth: number;
    duration: number;
}
export declare function ProvVisCreator<T, S extends string, A>(node: Element, prov: Provenance<T, S, A>, callback?: (id: NodeID) => void, buttons?: boolean, ephemeralUndo?: boolean, fauxRoot?: NodeID, config?: Partial<ProvVisConfig>): void;
export declare function UndoRedoButtonCreator<T, S extends string, A>(node: Element, graph: ProvenanceGraph<S, A>, undoCallback: () => void, redoCallback: () => void): void;
