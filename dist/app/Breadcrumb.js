import * as React from 'react';
import { CollapsedBreadcrumb } from '../components/breadcrumb/CollapsedBreadcrumb';
import { SingleBreadcrumb } from '../components/breadcrumb/SingleBreadcrumb';
import { useAppDispatch, useAppSelector } from '../hooks';
import { changeFocus } from '../store/ordinoSlice';
export function Breadcrumb() {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    //Obviously change this to the right way of importing these colors
    const colorPalette = ['#337ab7', '#ec6836', '#75c4c2', '#e9d36c', '#24b466', '#e891ae', '#db933c', '#b08aa6', '#8a6044', '#7b7b7b'];
    //always show first, last, context, +, otherwise show ...
    return (React.createElement("div", { className: "d-flex breadcrumb overflow-hidden" },
        ordino.focusViewIndex > 1 ? React.createElement(SingleBreadcrumb, { workbench: ordino.workbenches[0], color: colorPalette[0], flexWidth: 5, first: true, onClick: () => dispatch(changeFocus({ index: 0 })) }) : null,
        ordino.focusViewIndex === 3 ? React.createElement(SingleBreadcrumb, { workbench: ordino.workbenches[1], color: colorPalette[1], flexWidth: 5, first: false, onClick: () => dispatch(changeFocus({ index: 1 })) }) : null,
        ordino.focusViewIndex > 3 ? React.createElement(CollapsedBreadcrumb, { color: colorPalette[0], flexWidth: 5 }) : null,
        ordino.focusViewIndex > 0 ? React.createElement(SingleBreadcrumb, { workbench: ordino.workbenches[ordino.focusViewIndex - 1], color: colorPalette[ordino.focusViewIndex - 1], flexWidth: 5, first: ordino.focusViewIndex - 1 === 0, onClick: () => dispatch(changeFocus({ index: ordino.focusViewIndex - 1 })) }) : null,
        React.createElement(SingleBreadcrumb, { workbench: ordino.workbenches[ordino.focusViewIndex], color: colorPalette[ordino.focusViewIndex % colorPalette.length], flexWidth: 80, first: ordino.focusViewIndex === 0, onClick: () => dispatch(changeFocus({ index: ordino.focusViewIndex })) }),
        React.createElement(SingleBreadcrumb, { flexWidth: 3, first: false }),
        ordino.focusViewIndex + 1 < ordino.workbenches.length ? React.createElement(SingleBreadcrumb, { workbench: ordino.workbenches[ordino.focusViewIndex + 1], color: colorPalette[ordino.focusViewIndex + 1], flexWidth: 5, first: false, onClick: () => dispatch(changeFocus({ index: ordino.focusViewIndex + 1 })) }) : null,
        ordino.focusViewIndex + 3 < ordino.workbenches.length ? React.createElement(CollapsedBreadcrumb, { color: colorPalette[1], flexWidth: 5 }) : null,
        ordino.focusViewIndex + 3 === ordino.workbenches.length ? React.createElement(SingleBreadcrumb, { workbench: ordino.workbenches[ordino.workbenches.length - 1], color: colorPalette[ordino.workbenches.length - 1], flexWidth: 5, first: false, onClick: () => dispatch(changeFocus({ index: ordino.workbenches.length - 1 })) }) : null));
}
//# sourceMappingURL=Breadcrumb.js.map