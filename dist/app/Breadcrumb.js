import * as React from 'react';
import { SingleBreadcrumb } from '../components/breadcrumb/SingleBreadcrumb';
import { useAppDispatch, useAppSelector } from '../hooks';
import { changeFocus } from '../store/ordinoSlice';
export function Breadcrumb() {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();
    //Obviously change this to the right way of importing these colors
    const colorPalette = ['#337ab7', '#ec6836', '#75c4c2', '#e9d36c', '#24b466', '#e891ae', '#db933c', '#b08aa6', '#8a6044', '#7b7b7b'];
    return (React.createElement("div", { className: "d-flex breadcrumb overflow-hidden" },
        ordino.workbenches.map((v, i) => {
            return (React.createElement(SingleBreadcrumb, { workbench: v, color: colorPalette[i % colorPalette.length], flexWidth: v.index === ordino.focusViewIndex ? 80 : 5, key: v.index, first: v.index === 0, onClick: () => dispatch(changeFocus({ index: v.index })) }));
        }),
        React.createElement(SingleBreadcrumb, { flexWidth: 3, first: false })));
}
//# sourceMappingURL=Breadcrumb.js.map