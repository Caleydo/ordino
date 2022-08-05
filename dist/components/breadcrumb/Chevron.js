import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { I18nextManager } from 'tdp_core';
import { animated, easings, useSpring } from 'react-spring';
import { changeFocus, removeWorkbench, setAnimating } from '../../store';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FilterAndSelected } from './FilterAndSelected';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { ChevronSvg } from './ChevronSvg';
import { isFirstWorkbench, isFocusWorkbench, isNextWorkbench } from '../../store/storeUtils';
export function Chevron({ first = false, flexWidth = 1, onClick = null, color = 'cornflowerblue', workbench = null, hideText = false }) {
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
    return (React.createElement(animated.div, { className: `text-truncate position-relative d-flex justify-content-center ${onClick ? 'cursor-pointer' : ''}`, ref: ref, style: { ...animatedStyle, flexBasis: 0 }, onClick: onClick, title: !isFocusWorkbench(workbench) && !(isNextWorkbench(workbench) && ordino.midTransition)
            ? I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.workbenchName', { workbenchName: workbench.name })
            : null },
        isFocusWorkbench(workbench) || (isNextWorkbench(workbench) && ordino.midTransition) ? (React.createElement("div", { className: `text-truncate chevronDiv d-flex flex-grow-1 ${isFirstWorkbench(workbench) ? 'ms-2' : 'ms-3'}`, style: { flexBasis: 0 } },
            React.createElement("p", { className: "chevronText text-truncate flex-grow-1" }, I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.workbenchName', { workbenchName: workbench.name })))) : null,
        React.createElement("div", { className: "me-2 ms-2 text-truncate chevronDiv justify-content-center d-flex", style: { flexBasis: 0, flexGrow: 2 } }, isFocusWorkbench(workbench) && !animatedStyle.flexGrow.isAnimating ? (React.createElement(FilterAndSelected, null)) : !isFocusWorkbench(workbench) && !hideText && !(isNextWorkbench(workbench) && ordino.midTransition) ? (React.createElement("p", { className: "text-center text-truncate chevronText flex-grow-1 justify-content-center" }, workbench.name)) : null),
        isFocusWorkbench(workbench) || (isNextWorkbench(workbench) && ordino.midTransition) ? (React.createElement("div", { className: `${!hideText ? 'me-2' : ''} chevronDiv flex-grow-1 d-flex justify-content-end`, style: { flexBasis: 0 } },
            React.createElement("button", { type: "button", className: `${isFirstWorkbench(workbench) ? 'd-none' : ''} btn-close btn-close-white me-2 pe-auto`, "aria-label": I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.close'), onClick: () => {
                    dispatch(changeFocus({ index: workbench.index - 1 }));
                    dispatch(removeWorkbench({ index: workbench.index }));
                } }))) : null,
        React.createElement(ChevronSvg, { color: color, width: width, isFirst: first, isClickable: !!onClick })));
}
//# sourceMappingURL=Chevron.js.map