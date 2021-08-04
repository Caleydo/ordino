/// <reference types="react" />
import { NodeID, ProvenanceGraph } from '@visdesignlab/trrack';
import { EventConfig } from '../Utils/EventConfig';
export interface BookmarkListViewConfig<T, S extends string, A> {
    graph?: ProvenanceGraph<S, A>;
    eventConfig?: EventConfig<S>;
    currentNode: NodeID;
}
declare function BookmarkListView<T, S extends string, A>({ graph, eventConfig, currentNode, }: BookmarkListViewConfig<T, S, A>): JSX.Element;
export default BookmarkListView;
