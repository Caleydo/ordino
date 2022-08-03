export default function findBundleParent(nodeId, bundleMap) {
    const parentList = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const bundle in bundleMap) {
        if (bundleMap[bundle].bunchedNodes.includes(nodeId)) {
            parentList.push(bundle);
        }
    }
    console.log('testing');
    return parentList;
}
//# sourceMappingURL=findBundleParent.js.map