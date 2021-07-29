import { ProvenanceGraph } from '@visdesignlab/trrack';
export interface BookmarkToggleConfig<T, S extends string, A> {
    graph?: ProvenanceGraph<T, S, A>;
    bookmarkView: boolean;
    setBookmarkView: (b: boolean) => void;
}
declare function BookmarkToggle<T, S extends string, A>({ graph, bookmarkView, setBookmarkView, }: BookmarkToggleConfig<T, S, A>): JSX.Element;
export default BookmarkToggle;
