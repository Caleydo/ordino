/* eslint-disable no-plusplus */
export default function BookmarkTransitions(xOffset, yOffset, nodeList) {
    xOffset = -xOffset;
    const start = (data) => {
        const index = nodeList.findIndex(d => d.id === data.id);
        const x = 0;
        const y = 40 * index;
        return { x, y: y - yOffset, opacity: 0 };
    };
    const enter = (data) => {
        const index = nodeList.findIndex(d => d.id === data.id);
        const x = 0;
        const y = 40 * index;
        return {
            x: [x],
            y: [y],
            opactiy: 1,
        };
    };
    const update = (data) => {
        const index = nodeList.findIndex(d => d.id === data.id);
        const x = 0;
        const y = 40 * index;
        return {
            x: [x],
            y: [y],
            opactiy: 1,
        };
    };
    return {
        enter,
        leave: start,
        update,
        start,
    };
}
//# sourceMappingURL=BookmarkTransitions.js.map