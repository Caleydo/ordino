import React from 'react';
import { useSpring, animated, easings } from 'react-spring';
export function AnimatedLine({ x1Width, x2Width, y1Depth, y2Depth, y1Offset, y2Offset, config, }) {
    const style = useSpring({
        config: {
            duration: config.animationDuration,
            easing: easings.easeInOutSine,
        },
        x1: x1Width * config.gutter,
        x2: x2Width * config.gutter,
        y1: y1Depth * config.verticalSpace + y1Offset,
        y2: y2Depth * config.verticalSpace + y2Offset,
    });
    return React.createElement(animated.line, { ...style, stroke: "black", pointerEvents: "none" });
}
//# sourceMappingURL=AnimatedLine.js.map