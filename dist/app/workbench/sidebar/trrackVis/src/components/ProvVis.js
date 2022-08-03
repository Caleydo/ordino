import React, { useMemo } from 'react';
import { Tree } from './Tree';
import { useComputeNodePosition } from './useComputeNodePosition';
const defaultConfig = {
    gutter: 25,
    verticalSpace: 50,
    marginTop: 50,
    marginLeft: 50,
    animationDuration: 500,
    annotationHeight: 150,
    nodeAndLabelGap: 20,
    labelWidth: 150,
    iconConfig: null,
    changeCurrent: () => null,
    bookmarkNode: () => null,
    annotateNode: () => null,
    getAnnotation: (id) => '',
    isBookmarked: (id) => false,
};
export function ProvVis({ nodeMap, root, currentNode, config }) {
    const { stratifiedMap: nodePositions, links } = useComputeNodePosition(nodeMap, currentNode, root);
    console.log(currentNode);
    const mergedConfig = useMemo(() => {
        return { ...defaultConfig, ...config };
    }, [config]);
    return React.createElement(Tree, { nodes: nodePositions, links: links, config: mergedConfig, currentNode: currentNode });
}
//# sourceMappingURL=ProvVis.js.map