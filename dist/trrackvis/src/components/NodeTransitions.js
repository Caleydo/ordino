import { getX } from './LinkTransitions';
export default function nodeTransitions(xOffset, yOffset, clusterOffset, backboneOffset, duration = 500, annotationOpen, annotationHeight) {
    xOffset = -xOffset;
    backboneOffset = -backboneOffset;
    const start = (data) => {
        let clusteredNodesInFront = 0;
        const x = getX(data.width, xOffset, backboneOffset);
        // eslint-disable-next-line max-len
        clusteredNodesInFront =
            clusteredNodesInFront === 0
                ? clusteredNodesInFront
                : clusteredNodesInFront - 1;
        let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (annotationOpen !== -1 &&
            data.depth > annotationOpen &&
            data.width === 0) {
            y += annotationHeight;
        }
        return { x, y: y - yOffset, opacity: 0 };
    };
    const enter = (data) => {
        let clusteredNodesInFront = 0;
        const x = getX(data.width, xOffset, backboneOffset);
        // eslint-disable-next-line max-len
        clusteredNodesInFront =
            clusteredNodesInFront === 0
                ? clusteredNodesInFront
                : clusteredNodesInFront - 1;
        let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (annotationOpen !== -1 &&
            data.depth > annotationOpen &&
            data.width === 0) {
            y += annotationHeight;
        }
        return {
            x: [x],
            y: [y],
            opactiy: 1,
            timing: { duration },
        };
    };
    const update = (data) => {
        let clusteredNodesInFront = 0;
        const x = getX(data.width, xOffset, backboneOffset);
        // eslint-disable-next-line max-len
        clusteredNodesInFront =
            clusteredNodesInFront === 0
                ? clusteredNodesInFront
                : clusteredNodesInFront - 1;
        let y = yOffset * data.depth - (yOffset - clusterOffset) * clusteredNodesInFront;
        if (annotationOpen !== -1 &&
            data.depth > annotationOpen &&
            data.width === 0) {
            y += annotationHeight;
        }
        return {
            x: [x],
            y: [y],
            opactiy: 1,
            timing: { duration },
        };
    };
    return {
        enter,
        leave: start,
        update,
        start,
    };
}
//# sourceMappingURL=NodeTransitions.js.map