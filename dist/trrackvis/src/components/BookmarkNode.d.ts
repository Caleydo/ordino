import { StateNode } from '@visdesignlab/trrack';
import { EventConfig } from '../Utils/EventConfig';
interface BookmarkNodeProps<T, S extends string, A> {
    current: boolean;
    node: StateNode<S, A>;
    nodeMap: any;
    editAnnotations: boolean;
    eventConfig?: EventConfig<S>;
}
declare function BookmarkNode<T, S extends string, A>({ current, node, eventConfig, }: BookmarkNodeProps<T, S, A>): JSX.Element;
export default BookmarkNode;
