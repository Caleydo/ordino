import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { I18nextManager } from 'tdp_core';
import { animated, easings, useSpring } from 'react-spring';
import { changeFocus, removeWorkbench, setAnimating, setCommentsOpen } from '../../store';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FilterAndSelected } from './FilterAndSelected';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { OpenCommentsButton } from './OpenCommentsButton';
import { BreadcrumbSvg } from './BreadcrumbSvg';
export function SingleBreadcrumb({ first = false, flexWidth = 1, onClick = null, color = 'cornflowerblue', workbench = null }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [width, setWidth] = useState();
    const animatedStyle = useSpring({
        onStart: () => {
            dispatch(setAnimating(true));
        },
        onRest: () => {
            dispatch(setAnimating(false));
        },
        flexGrow: flexWidth,
        config: { duration: 700, easing: easings.easeInOutSine },
    });
    const ref = useRef(null);
    useEffect(() => {
        const ro = new ResizeObserver((entries) => {
            entries.forEach((e) => {
                setWidth(e.contentRect.width);
            });
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);
    const onCommentPanelVisibilityChanged = React.useCallback((isOpen) => dispatch(setCommentsOpen({ workbenchIndex: workbench === null || workbench === void 0 ? void 0 : workbench.index, isOpen })), [workbench === null || workbench === void 0 ? void 0 : workbench.index, dispatch]);
    return (React.createElement(animated.div, { className: `position-relative ${onClick ? 'cursor-pointer' : ''}`, ref: ref, style: { ...animatedStyle }, onClick: onClick },
        React.createElement("div", { className: `position-absolute chevronDiv ${workbench.index !== ordino.focusWorkbenchIndex} top-50 start-50 translate-middle d-flex` }, workbench.index === ordino.focusWorkbenchIndex && !animatedStyle.flexGrow.isAnimating ? (React.createElement(React.Fragment, null,
            React.createElement(FilterAndSelected, null),
            React.createElement(OpenCommentsButton, { idType: workbench.itemIDType, selection: workbench.selection, commentPanelVisible: workbench.commentsOpen, onCommentPanelVisibilityChanged: onCommentPanelVisibilityChanged }))) : workbench.index !== ordino.focusWorkbenchIndex ? (React.createElement("p", { className: "chevronText flex-grow-1" }, workbench.name.slice(0, 5))) : null),
        React.createElement("div", { className: "position-absolute chevronDiv top-50 translate-middle-y d-flex", style: { left: (workbench === null || workbench === void 0 ? void 0 : workbench.index) === 0 ? '5px' : '20px' } }, workbench && workbench.index === ordino.focusWorkbenchIndex ? (React.createElement("p", { className: "chevronText flex-grow-1" }, I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.workbenchName', { workbenchName: workbench.name }))) : null),
        React.createElement("div", { className: "position-absolute chevronDiv top-50 translate-middle-y d-flex", style: { right: '8px' } }, workbench && workbench.index === ordino.focusWorkbenchIndex ? (ordino.focusWorkbenchIndex > 0 ? (React.createElement("button", { type: "button", className: "btn-close btn-close-white me-2 pe-auto", "aria-label": I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.close'), onClick: () => {
                dispatch(changeFocus({ index: workbench.index - 1 }));
                dispatch(removeWorkbench({ index: workbench.index }));
            } })) : null) : null),
        React.createElement(BreadcrumbSvg, { color: color, width: width, first: first, clickable: !!onClick })));
}
//# sourceMappingURL=SingleBreadcrumb.js.map