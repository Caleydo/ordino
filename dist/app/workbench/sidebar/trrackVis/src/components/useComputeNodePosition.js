import { isStateNode } from '@trrack/core';
import { stratify } from 'd3v7';
import { useMemo } from 'react';
// eslint-disable-next-line import/no-cycle
import { treeLayout } from '../Utils/TreeLayout';
export function useComputeNodePosition(nodeMap, current, root) {
    const { stratifiedMap, links } = useMemo(() => {
        const nodeList = Object.values(nodeMap);
        const strat = stratify()
            .id((d) => d.id)
            .parentId((d) => {
            if (d.id === root)
                return null;
            if (isStateNode(d)) {
                return d.parent;
            }
            return null;
        });
        const stratifiedTree = strat(nodeList);
        const stratifiedList = stratifiedTree.descendants();
        const innerMap = {};
        stratifiedList.forEach((c) => {
            innerMap[c.id] = c;
        });
        treeLayout(innerMap, current, root);
        return { stratifiedMap: innerMap, links: stratifiedTree.links() };
    }, [current, root, nodeMap]);
    return { stratifiedMap, links };
}
//# sourceMappingURL=useComputeNodePosition.js.map