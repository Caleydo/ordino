import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { I18nextManager } from 'tdp_core';
import { changeFocus, removeWorkbench, setCommentsOpen } from '../../store';
import { ChevronBreadcrumb } from './ChevronBreadcrumb';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FilterAndSelected } from './FilterAndSelected';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { OpenCommentsButton } from './OpenCommentsButton';
export function SingleBreadcrumb({ first = false, flexWidth = 1, onClick = null, color = 'cornflowerblue', workbench = null }) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    const [width, setWidth] = useState();
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
    console.log(workbench);
    return (React.createElement("div", { className: `position-relative ${onClick ? 'cursor-pointer' : ''}`, ref: ref, style: { flexGrow: flexWidth }, onClick: onClick },
        React.createElement("div", { className: "position-absolute chevronDiv top-50 start-50 translate-middle d-flex" }, workbench ? (workbench.index === ordino.focusWorkbenchIndex ? (React.createElement(React.Fragment, null,
            React.createElement(FilterAndSelected, null),
            React.createElement(OpenCommentsButton, { idType: workbench.itemIDType, selection: workbench.selection, commentPanelVisible: workbench.commentsOpen, onCommentPanelVisibilityChanged: onCommentPanelVisibilityChanged }))) : (React.createElement("p", { className: "chevronText flex-grow-1" }, workbench.name.slice(0, 5)))) : (React.createElement("div", { className: "flex-grow-1 chevronText d-flex align-items-center" },
            React.createElement("i", { className: "fas fa-cog pe-2" }),
            React.createElement("p", { className: "text-nowrap w-100 flex-grow-1 m-0 p-0" }, "Add Views")))),
        React.createElement("div", { className: "position-absolute chevronDiv top-50 translate-middle-y d-flex", style: { left: (workbench === null || workbench === void 0 ? void 0 : workbench.index) === 0 ? '5px' : '20px' } }, workbench && workbench.index === ordino.focusWorkbenchIndex ? (React.createElement("p", { className: "chevronText flex-grow-1" }, I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.workbenchName', { workbenchName: workbench.name }))) : null),
        React.createElement("div", { className: "position-absolute chevronDiv top-50 translate-middle-y d-flex", style: { right: '8px' } }, workbench && workbench.index === ordino.focusWorkbenchIndex ? (ordino.focusWorkbenchIndex > 0 ? (React.createElement("button", { type: "button", className: "btn-close btn-close-white me-2", "aria-label": I18nextManager.getInstance().i18n.t('tdp:ordino.breadcrumb.close'), onClick: () => {
                dispatch(changeFocus({ index: workbench.index - 1 }));
                dispatch(removeWorkbench({ index: workbench.index }));
            } })) : null) : null),
        React.createElement(ChevronBreadcrumb, { color: color, width: width, first: first })));
}
//# sourceMappingURL=SingleBreadcrumb.js.map