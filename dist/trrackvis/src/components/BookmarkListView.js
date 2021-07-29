import React from 'react';
import { NodeGroup } from 'react-move';
import translate from '../Utils/translate';
import BookmarkNode from './BookmarkNode';
import BookmarkTransitions from './BookmarkTransitions';
function BookmarkListView({ graph, eventConfig, currentNode, }) {
    if (graph === undefined) {
        return null;
    }
    const gutter = 15;
    const verticalSpace = 50;
    const bookmarks = [];
    const xOffset = gutter;
    const yOffset = verticalSpace;
    // eslint-disable-next-line no-restricted-syntax
    for (const j in graph.nodes) {
        if (graph.nodes[j].bookmarked) {
            bookmarks.push(graph.nodes[j]);
        }
    }
    return (React.createElement(NodeGroup, Object.assign({ data: bookmarks, keyAccessor: (d) => d.label }, BookmarkTransitions(xOffset, yOffset, bookmarks)), (innerBookmarks) => (React.createElement(React.Fragment, null, innerBookmarks.map((bookmark) => {
        const { data: d, key, state } = bookmark;
        return (React.createElement("g", { key: key, transform: translate(state.x, state.y) },
            React.createElement(BookmarkNode, { current: currentNode === d.id, node: d, nodeMap: innerBookmarks, editAnnotations: false, eventConfig: eventConfig })));
    })))));
}
export default BookmarkListView;
//# sourceMappingURL=BookmarkListView.js.map