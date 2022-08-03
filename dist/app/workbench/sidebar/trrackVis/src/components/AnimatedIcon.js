import React, { useMemo } from 'react';
import { useSpring, animated, easings } from 'react-spring';
import { defaultIcon } from '../Utils/IconConfig';
export function AnimatedIcon({ width, depth, yOffset, onClick, config, node, currentNode, isHover, setHover, colorMap, }) {
    const style = useSpring({
        config: {
            duration: config.animationDuration,
            easing: easings.easeInOutSine,
        },
        transform: `translate(${width * config.gutter}, ${depth * config.verticalSpace + yOffset})`,
    });
    const icon = useMemo(() => {
        var _a;
        const currentIconConfig = (_a = config.iconConfig) === null || _a === void 0 ? void 0 : _a[node.meta.eventType];
        const currDefaultIcon = defaultIcon(colorMap[node.meta.eventType]);
        if (currentIconConfig && currentIconConfig.glyph) {
            if (node.id === currentNode && currentIconConfig.currentGlyph) {
                return currentIconConfig.currentGlyph(node);
            }
            if (isHover && currentIconConfig.hoverGlyph) {
                return currentIconConfig.hoverGlyph(node);
            }
            if (width === 0 && currentIconConfig.backboneGlyph) {
                return currentIconConfig.backboneGlyph(node);
            }
            return currentIconConfig.glyph(node);
        }
        if (node.id === currentNode) {
            return currDefaultIcon.currentGlyph(node);
        }
        if (isHover) {
            return currDefaultIcon.hoverGlyph(node);
        }
        if (width === 0) {
            return currDefaultIcon.backboneGlyph(node);
        }
        return currDefaultIcon.glyph(node);
    }, [config.iconConfig, currentNode, isHover, width, colorMap, node]);
    return (React.createElement(animated.g, { ...style, cursor: "pointer", onClick: onClick, onMouseOver: () => {
            if (!style.transform.isAnimating) {
                setHover(node.id);
            }
        }, onMouseOut: () => setHover(null) }, icon));
}
//# sourceMappingURL=AnimatedIcon.js.map