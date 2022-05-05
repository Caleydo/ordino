import * as React from 'react';
import { useMemo } from 'react';
import { MosaicWindow } from 'react-mosaic-component';
import { I18nextManager } from 'tdp_core';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { removeView, setView } from '../../store';
import { findViewIndex } from '../../store/storeUtils';
import { EViewChooserMode, ViewChooser } from '../ViewChooser';
export function WorkbenchEmptyView({ workbenchIndex, view, chooserOptions, dragMode, path, setMosaicDrag, removeCallback, }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const viewIndex = useMemo(() => {
        return findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]);
    }, [ordino.workbenches, view.uniqueId, workbenchIndex]);
    return (React.createElement(MosaicWindow, { path: path, title: view.name, renderToolbar: () => workbenchIndex === ordino.focusWorkbenchIndex ? (React.createElement("div", { className: "d-flex w-100" },
            React.createElement("div", { className: "view-actions d-flex justify-content-end flex-grow-1" },
                React.createElement("button", { type: "button", onClick: () => {
                        removeCallback(path);
                        dispatch(removeView({ workbenchIndex, viewIndex }));
                    }, className: "btn btn-icon-dark align-middle m-1" },
                    React.createElement("i", { className: "flex-grow-1 fas fa-times m-1" }))))) : (React.createElement("div", { className: "view-parameters d-flex" })), onDragStart: () => setMosaicDrag(true), onDragEnd: () => setMosaicDrag(false) },
        React.createElement("div", { id: view.id, className: `position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1 ${dragMode ? 'pe-none' : ''}` },
            React.createElement("div", { className: "inner d-flex" },
                React.createElement(ViewChooser, { views: chooserOptions, showBurgerMenu: false, mode: EViewChooserMode.EMBEDDED, onSelectedView: (newView) => {
                        dispatch(setView({
                            workbenchIndex,
                            viewIndex: findViewIndex(view.uniqueId, ordino.workbenches[workbenchIndex]),
                            viewId: newView.id,
                            viewName: newView.name,
                        }));
                    }, isEmbedded: false }),
                React.createElement("div", { className: "w-100 d-flex justify-content-center align-items-center" },
                    React.createElement("p", { className: "emptyViewText" }, I18nextManager.getInstance().i18n.t('tdp:ordino.views.selectView')))))));
}
//# sourceMappingURL=WorkbenchEmptyView.js.map