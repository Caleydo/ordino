/* eslint-disable import/no-cycle */
import { isStateNode } from '@trrack/core';
import React from 'react';
import { useSpring, animated, easings } from 'react-spring';
import { AnnotationButton } from './AnnotationButton';
import { BookmarkButton } from './BookmarkButton';
import { AnnotationField } from './AnnotationField';
export function NodeDescription({ depth, yOffset, node, config, currentNode, onClick, isHover, setHover, colorMap, annotationDepth, setAnnotationDepth, }) {
    const style = useSpring({
        config: {
            duration: config.animationDuration,
            easing: easings.easeInOutSine,
        },
        top: depth * config.verticalSpace + config.marginTop / 2 + yOffset,
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(animated.div, { style: {
                ...style,
                cursor: 'pointer',
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                height: config.verticalSpace,
                justifyContent: 'center',
                alignItems: 'end',
                width: `${config.labelWidth}px`,
            }, onClick: onClick, onMouseEnter: () => setHover(node.id), onMouseLeave: () => setHover(null) },
            React.createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                } },
                isHover || annotationDepth === depth ? (React.createElement(AnnotationButton, { color: "cornflowerblue", isAnnotating: annotationDepth === depth, onClick: () => setAnnotationDepth(depth) })) : null,
                isHover || config.isBookmarked(node.id) ? (React.createElement(BookmarkButton, { color: colorMap[node.meta.eventType], isBookmarked: config.isBookmarked(node.id), onClick: () => config.bookmarkNode(node.id) })) : null,
                React.createElement("div", { style: {
                        // width: `${config.labelWidth}px`,
                        alignItems: 'end',
                        display: 'flex',
                        flexDirection: 'column',
                    } },
                    React.createElement("p", { style: {
                            maxWidth: `${config.labelWidth}px`,
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        } }, node.label),
                    isStateNode(node) ? (React.createElement("p", { style: {
                            maxWidth: `${config.labelWidth}px`,
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: 'gray',
                        } }, config.getAnnotation(node.id))) : null))),
        annotationDepth === depth ? (React.createElement(animated.div, { style: {
                cursor: 'pointer',
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'start',
                fontSize: '12px !important',
                width: `250px`,
                zIndex: 10,
                top: style.top.to((num) => num + config.verticalSpace),
            } },
            React.createElement(AnnotationField, { config: config, node: node, setAnnotationDepth: setAnnotationDepth }))) : null));
}
//# sourceMappingURL=NodeDescription.js.map