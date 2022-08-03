/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
export default function findBackboneBundleNodes(nodeMap, bundleMap) {
    const backboneBundleNodes = [];
    for (const bundle in bundleMap) {
        let flag = true;
        if (nodeMap[bundle].width !== 0) {
            flag = false;
        }
        for (const i of bundleMap[bundle].bunchedNodes) {
            if (nodeMap[i].width !== 0) {
                flag = false;
            }
        }
        if (flag) {
            backboneBundleNodes.push(bundle);
            for (const n of bundleMap[bundle].bunchedNodes) {
                backboneBundleNodes.push(n);
            }
        }
    }
    return backboneBundleNodes;
}
//# sourceMappingURL=findBackboneBundleNodes.js.map